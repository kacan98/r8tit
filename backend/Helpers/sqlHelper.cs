using System.Data;
using Dapper;
using R8titAPI.Models;
using R8titAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace R8titAPI.Helpers
{
    public class SqlHelper
    {
        private readonly DataContextDapper _dapper;
        public SqlHelper(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
        }

        public bool UpsertUser(User user)
        {
            string sql = @"EXEC R8titSchema.spUser_Upsert
                @Username = @UsernameParameter, 
                @ImageId = @ImageIdParameter,
                @Email = @EmailParameter, 
                @Active = @ActiveParameter, 
                @UserId = @UserIdParameter";

            DynamicParameters sqlParameters = new DynamicParameters();

            sqlParameters.Add("@UsernameParameter", user.Username, DbType.String);
            sqlParameters.Add("@EmailParameter", user.Email, DbType.String);
            sqlParameters.Add("@ActiveParameter", user.Active, DbType.Boolean);
            sqlParameters.Add("@ImageIdParameter", user.ImageId, DbType.Int32);
            sqlParameters.Add("@UserIdParameter", user.UserId, DbType.Int32);

            return _dapper.ExecuteSql(sql, sqlParameters);
        }
    }
}