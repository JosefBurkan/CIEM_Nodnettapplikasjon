﻿namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Users
{
    public class DepartmentLeaderModel : UserModel
    {

        public DepartmentLeaderModel() : base("leaderUsername", "leader@example.com", "555-5678", "password", "Leader")
        {
        }

    }
}
