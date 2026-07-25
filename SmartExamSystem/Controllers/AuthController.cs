using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartExamSystem.Data;
using SmartExamSystem.DTOs;
using SmartExamSystem.Models;
using SmartExamSystem.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartExamSystem.Controllers   
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AuthController(ApplicationDbContext context,IConfiguration configuration,EmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService= emailService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto model)
        {
            try
            {
                var userExists = _context.Users.Any(x => x.Email == model.Email);

                if (userExists)
                {
                    return BadRequest("User already exists");
                }

                User user = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    Password = model.Password,
                    Role = model.Role
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok("Registered Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto model)
        {
            Console.WriteLine($"EMAIL=[{model.Email}]");
            Console.WriteLine($"PASSWORD=[{model.Password}]");

            var user = _context.Users.FirstOrDefault(
                x => x.Email == model.Email &&
                     x.Password == model.Password);

            if (user == null)
                return Unauthorized("Invalid Credential");

            var token = GenerateToken(user);

            return Ok(new { token });
        }

        private string GenerateToken(User user)
        {
            var key =
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!);

            var claims = new[] 
            {
                new Claim(ClaimTypes.Name,user.Email),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim("UserId",user.Id.ToString())
            };

            var token =
                new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddHours(2),

                    signingCredentials:
                        new SigningCredentials(
                            new SymmetricSecurityKey(key),
                            SecurityAlgorithms.HmacSha256)

                    );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
        [HttpGet("all")]
        public IActionResult All()
        {
            return Ok(_context.Users.ToList());
        }
    }
}
