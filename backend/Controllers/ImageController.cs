using R8titAPI.Helpers;
using R8titAPI.Data;
using R8titAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dapper;

namespace R8titAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {

        private readonly SqlHelper _sqlHelper;
        private readonly DataContextDapper _dapper;
        private readonly ImageHelper _imageHelper;
        public ImageController(IConfiguration config)
        {
            _sqlHelper = new SqlHelper(config);
            _dapper = new DataContextDapper(config);
            _imageHelper = new ImageHelper(config);
        }

        //TODO: 
        // Use dependency injection for SqlHelper and DataContextDapper instances.

        // The user can only add images for objects (s)he created
        [HttpPost("upload")]
        public IActionResult UploadImage(IFormFile file, int relatedObjectId, string relatedObjectTable)
        {
            try
            {
                // Check if file has the right extension
                string fileExtension = Path.GetExtension(file.FileName);
                if (fileExtension != ".jpg" && fileExtension != ".jpeg" && fileExtension != ".png")
                {
                    return new ObjectResult(new { message = "Invalid file extension" })
                    {
                        StatusCode = 400
                    };
                }

                // Check if relatedObjectTable exists
                if (_dapper.DoesTableExist(relatedObjectTable) == false)
                {
                    return new ObjectResult(new { message = "Invalid relatedObjectTable" })
                    {
                        StatusCode = 400
                    };
                }

                // Check if object exists
                // Should be safe to use relatedObjectTable here because we checked if it exists above
                string relatedObjectColumnName = relatedObjectTable.TrimEnd(new char[] { 's' }) + "Id"; //eg. SupermarketId
                string sqlToGetObject = $@"SELECT * FROM R8titSchema.{relatedObjectTable}
                                        WHERE {relatedObjectColumnName} = @RelatedObjectIdParam";
                DynamicParameters parametersToGetObject = new DynamicParameters();
                parametersToGetObject.Add("@RelatedObjectIdParam", relatedObjectId);

                if (_dapper.AtLeastOneEntryExists(sqlToGetObject, parametersToGetObject) == false)
                {
                    return new ObjectResult(new { message = "Invalid relatedObjectId" })
                    {
                        StatusCode = 400
                    };
                }

                // Check if user created object
                string sqlToGetRelatedObject = $@"SELECT * FROM R8titSchema.{relatedObjectTable}
                                            WHERE {relatedObjectColumnName} = @RelatedObjectIdParam 
                                            AND CreatedByUserId = @UserMakingRequest";

                DynamicParameters parametersToGetRelatedObject = new DynamicParameters();
                parametersToGetRelatedObject.Add("@RelatedObjectIdParam", relatedObjectId);
                parametersToGetRelatedObject.Add("@UserMakingRequest", this.User.FindFirst("userId")?.Value);

                if (_dapper.AtLeastOneEntryExists(sqlToGetRelatedObject, parametersToGetRelatedObject) == false)
                {
                    return new ObjectResult(new { message = "You can only add images for objects you created" })
                    {
                        StatusCode = 403
                    };
                }

                // Compress to 800kb
                Console.WriteLine("Compressing image of size " + file.Length + " bytes");
                if (file.Length > 800000)
                {
                    file = _imageHelper.CompressImage(file, 800, 100);
                }

                // Convert file to byte array
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }

                if (fileBytes.Length == 0)
                {
                    return BadRequest(new { message = "Compression probably ruined the image" });
                }

                // Save to database
                Image image = new Image
                {
                    RelatedObjectTable = relatedObjectTable,
                    RelatedObjectId = relatedObjectId,
                    ImageData = fileBytes
                };

                string sql = @"EXEC R8titSchema.spImages_Upsert 
                            @UserMakingRequest = @UserMakingRequestParam,
                            @RelatedObjectId = @RelatedObjectIdParam,
                            @RelatedObjectTable = @RelatedObjectTableParam,
                            @ImageData = @ImageDataParam";

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@RelatedObjectIdParam", image.RelatedObjectId);
                parameters.Add("@RelatedObjectTableParam", image.RelatedObjectTable);
                parameters.Add("@ImageDataParam", image.ImageData);
                parameters.Add("@UserMakingRequestParam", this.User.FindFirst("userId")?.Value);
                try
                {
                    Image upsertedImage = _dapper.UpsertSql<Image>(sql, parameters);

                    return Ok(new { message = "Image uploaded successfully", image = upsertedImage });
                }
                catch (Exception ex)
                {

                    return BadRequest(new { message = "Failed to upload image: " + ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetImage(int id)
        {
            try
            {
                string sql = @"SELECT * FROM R8titSchema.Images WHERE ImageId = @ImageIdParam";
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ImageIdParam", id);
                var image = _dapper.LoadDataSingle<Image>(sql, parameters);

                if (image == null)
                {
                    return NotFound();
                }

                return File(image.ImageData, "image/jpeg");
            }
            catch (Exception ex)
            {
                // Handle exception
                return StatusCode(500, ex.Message);
            }
        }
    }
}