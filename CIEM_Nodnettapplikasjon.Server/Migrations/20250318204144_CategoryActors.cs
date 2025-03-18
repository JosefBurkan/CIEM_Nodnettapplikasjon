using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CIEM_Nodnettapplikasjon.Server.Migrations
{
    /// <inheritdoc />
    public partial class CategoryActors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Actors",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Actors");
        }
    }
}
