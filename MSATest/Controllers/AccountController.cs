using DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MSATest.Controllers
{
    public class AccountController : ApiController
    {
        private IAccountAccess accountAccess = new AccountAccess();
        [HttpGet]
        // GET api/<controller>
        public bool Login(string account, string password)
        {
            return accountAccess.Login(account, password);
        }

        

        // POST api/<controller>
        [HttpPost]
        public string Register([FromBody]AccountInfo accountInfo)
        {
            return accountAccess.Register(accountInfo.account, accountInfo.password);
        }
        public class AccountInfo
        {
            public string account { get; set; }
            public string password { get; set; }
        }
    }
}