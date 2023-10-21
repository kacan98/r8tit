using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Runtime.InteropServices;

namespace R8titAPI.Data
{
    class DataContextDapper
    {
        private readonly IConfiguration _config;
        public DataContextDapper(IConfiguration config)
        {
            _config = config;
        }

        public int ExecuteSql(string sql, DynamicParameters? parameters)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Execute(sql, parameters);
        }

        public T LoadDataSingle<T>(string sql, DynamicParameters parameters = null)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.QuerySingle<T>(sql, parameters);
        }

        public IEnumerable<T> LoadData<T>(string sql, DynamicParameters parameters = null)
        {
            IDbConnection dbConnection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            return dbConnection.Query<T>(sql, parameters);
        }
    }
}