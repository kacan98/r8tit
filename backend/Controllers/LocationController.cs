using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Models;

namespace R8titAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        public LocationController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient();
            _config = config;

        }

        [HttpGet]
        [Route("GetLocationDetails")]
        public async Task<IActionResult> Post(double longitude, double latitude)
        {
            string? positionstackKey = _config.GetSection("positionstackKey").Value;
            string url = $"http://api.positionstack.com/v1/reverse?access_key={positionstackKey}&query={latitude},{longitude}";

            HttpResponseMessage response = await _httpClient.GetAsync(url); 
            if (response.IsSuccessStatusCode)
            {
                LocationDataRoot? responseBody = await response.Content.ReadFromJsonAsync<LocationDataRoot>();
                if (responseBody != null && responseBody.Data != null)
                {
                    return Ok(responseBody.Data[0]);
                }
                return BadRequest();
            }
            return BadRequest();
        }
    }
}