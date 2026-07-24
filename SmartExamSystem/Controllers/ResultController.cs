using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartExamSystem.Data;
using SmartExamSystem.DTOs;
using SmartExamSystem.Models;
using SmartExamSystem.Services;

namespace SmartExamSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class ResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly EmailService _emailService;

        public ResultController(ApplicationDbContext context,EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Submit Exam
        [HttpPost("submit")]
        public IActionResult SubmitExam(SubmitExamDto model)
        {
            int score = 0;

            foreach (var answer in model.Answers)
            {
                var question = _context.Questions.Find(answer.QuestionId);

                if (question != null &&
                    question.CorrectAnswer == answer.SelectedOption)
                {
                    score++;
                }
            }

            int totalQuestions = model.Answers.Count;

            double percentage = totalQuestions > 0
                ? ((double)score / totalQuestions) * 100
                : 0;

            string status = percentage >= 40
                ? "Pass"
                : "Fail";

            var result = new Result
            {
                UserId = model.UserId,
                ExamId = model.ExamId,
                Score = score,
                Status = status,
                SubmittedAt = DateTime.Now
            };
            _context.Results.Add(result);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(
                    ex.InnerException?.Message ??
                    ex.Message
                );
            }

            var user =
    _context.Users.Find(model.UserId);

            if (user != null)
            {
                try
                {
                    _emailService.SendEmail(
                        user.Email,
                        "Exam Result",
                        $"Hello {user.Name},\n\n" +
                        $"Your Score: {score}\n" +
                        $"Status: {status}\n" +
                        $"Percentage: {percentage:F2}%"
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return Ok(new
            {
                Message = "Exam Submitted Successfully",
                Score = score,
                TotalQuestions = totalQuestions,
                Percentage = Math.Round(percentage, 2),
                Status = status
            });
        }

        // Get Results of a Student
        [HttpGet("student/{userId}")]
        public IActionResult GetStudentResults(int userId)
        {
            var results = _context.Results
                                  .Where(r => r.UserId == userId)
                                  .ToList();

            return Ok(results);
        }

        // Leaderboard
        [HttpGet("leaderboard")]
        public IActionResult GetLeaderboard()
        {
            var leaderboard = _context.Results
                                      .OrderByDescending(r => r.Score)
                                      .Take(10)
                                      .ToList();

            return Ok(leaderboard);
        }
    }
}