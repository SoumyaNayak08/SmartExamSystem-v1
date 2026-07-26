using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartExamSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddExamNavigationToResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Results_ExamId",
                table: "Results",
                column: "ExamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Exams_ExamId",
                table: "Results",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_Exams_ExamId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_ExamId",
                table: "Results");
        }
    }
}
