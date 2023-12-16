using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using R8titAPI.Helpers;

namespace R8titAPI.Data
{
    class DataContextDapper
    {
        private readonly IConfiguration _config;

        private readonly Dictionary<string, string> _tableIdMap = new()
            {
                { "Images", "ImageId" },
                { "RatingCategories", "RatingCategoryId" },
                { "Ratings", "RatingId" },
                { "Supermarkets", "SupermarketId" },
                { "Users", "UserId" }
            };
        public DataContextDapper(IConfiguration config)
        {
            _config = config;
        }

        public bool ExecuteSql(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Execute(sql) > 0;
        }

        public bool ExecuteSql(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Execute(sql, parameters) > 0;
        }

        public T UpsertSql<T>(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.QuerySingle<T>(sql, parameters);
        }

        public T LoadDataSingle<T>(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.QuerySingle<T>(sql);
        }


        public T LoadDataSingle<T>(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.QuerySingle<T>(sql, parameters);
        }

        public T? LoadDataSingleOrDefaultToNull<T>(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.QuerySingleOrDefault<T>(sql, parameters);
        }

        public IEnumerable<T> LoadData<T>(string sql)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Query<T>(sql);
        }

        public IEnumerable<T> LoadData<T>(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Query<T>(sql, parameters);
        }

        public bool DoesObjectExist(string table, int objectId)
        {
            using IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            string sql = "SELECT CASE WHEN EXISTS ((SELECT * FROM R8titSchema." + table + " WHERE " + _tableIdMap[table] + " = @Id)) THEN 1 ELSE 0 END";
            DynamicParameters dynParams = new();
            dynParams.Add("@Id", objectId);

            bool exists = dbConnection.ExecuteScalar<bool>(sql, dynParams);
            return exists;
        }

        public bool DoesTableExist(string tableName)
        {
            using IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            string sql = "SELECT CASE WHEN EXISTS ((SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @TableName)) THEN 1 ELSE 0 END";
            DynamicParameters dynParams = new();
            dynParams.Add("@TableName", tableName);
            
            bool exists = dbConnection.ExecuteScalar<bool>(sql, dynParams);
            return exists;
        }

        public bool AtLeastOneEntryExists(string sql, DynamicParameters parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.ExecuteScalar<bool>(sql, parameters);
        }
    }
}