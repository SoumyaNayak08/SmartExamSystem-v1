using SmartExamSystem.Models;
using System.ComponentModel.DataAnnotations;

public class Result
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public int ExamId { get; set; }

    public Exam? Exam { get; set; }

    public int Score { get; set; }

    public double Percentage => (double)Score / 10 * 100;

    public string Status { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}