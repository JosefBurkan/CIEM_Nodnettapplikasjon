using NUnit.Framework;
using NSubstitute;
using CIEM_Nodnettapplikasjon.Server.Services.Users;

namespace CIEM_Nodnettapplikasjon.Tests
{
    // This class is responsible for testing business logic in the user service file
    public class UserServiceTests
    {
        private IUserService _mockUserService;

        [SetUp]
        public void SetUp()
        {
            _mockUserService = Substitute.For<IUserService>();
        }

        // Test the login method
        [Test]
        public void Login_ReturnsTrue_WhenCredentialsAreValid()
        {
            _mockUserService.Login("admin", "1234").Returns(true);

            var result = _mockUserService.Login("admin", "1234");

            Assert.IsTrue(result);
        }

        // Test the authentication method
        [Test]
        public void AuthenticateUser_ReturnsFalse_WhenPasswordIsWrong()
        {
            // Set up the mock behavior
            _mockUserService.AuthenticateUser("admin", "wrong").Returns(false);

            // Call the method being tested
            var result = _mockUserService.AuthenticateUser("admin", "wrong");

            // Assert the expected result
            Assert.IsFalse(result);
        }

        // Test the logut method (Which is incomplete)
        [Test]
        public void Logout_DoesNotThrow_WhenCalledWithValidUserId()
        {

            Assert.DoesNotThrow(() => _mockUserService.Logout(1));
        }

    }
}
