﻿using System.ComponentModel.DataAnnotations; // For key attribute
using Microsoft.AspNetCore.Identity; // Identity features


namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class UserModel
    {
        [Key] // userID primary key
        public int userID { get; set; }


        public string name { get; set; }
        public string surname { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string password { get; set; }
        public string role { get; set; }

    }
}
