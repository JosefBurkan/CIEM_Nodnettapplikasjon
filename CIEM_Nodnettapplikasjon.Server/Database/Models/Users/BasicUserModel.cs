﻿using CIEM_Nodnettapplikasjon.Server.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Models.Users
{
    public class BasicUserModel : UserModel
    {

        public BasicUserModel()
        : base("JohnPork", "johnpork@gmail.com", "5559282", "password123", "User")
        {
        }

    }
}
