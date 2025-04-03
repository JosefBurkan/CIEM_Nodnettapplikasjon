using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CIEM_Nodnettapplikasjon.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToNodeNetworks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nodes_NodeNetworks_NodeNetworkNetworkID",
                table: "Nodes");

            migrationBuilder.DropIndex(
                name: "IX_Nodes_NodeNetworkNetworkID",
                table: "Nodes");

            migrationBuilder.RenameColumn(
                name: "NetworkID",
                table: "Nodes",
                newName: "networkID");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Nodes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "NodeID",
                table: "Nodes",
                newName: "nodeID");

            migrationBuilder.RenameColumn(
                name: "NodeNetworkNetworkID",
                table: "Nodes",
                newName: "layer");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "NodeNetworks",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "NetworkID",
                table: "NodeNetworks",
                newName: "networkID");

            migrationBuilder.RenameColumn(
                name: "TimeOfCreation",
                table: "NodeNetworks",
                newName: "time_of_creation");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "NodeNetworks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Actors",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nodes_networkID",
                table: "Nodes",
                column: "networkID");

            migrationBuilder.AddForeignKey(
                name: "FK_Nodes_NodeNetworks_networkID",
                table: "Nodes",
                column: "networkID",
                principalTable: "NodeNetworks",
                principalColumn: "networkID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nodes_NodeNetworks_networkID",
                table: "Nodes");

            migrationBuilder.DropIndex(
                name: "IX_Nodes_networkID",
                table: "Nodes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "NodeNetworks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Actors");

            migrationBuilder.RenameColumn(
                name: "networkID",
                table: "Nodes",
                newName: "NetworkID");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Nodes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "nodeID",
                table: "Nodes",
                newName: "NodeID");

            migrationBuilder.RenameColumn(
                name: "layer",
                table: "Nodes",
                newName: "NodeNetworkNetworkID");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "NodeNetworks",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "networkID",
                table: "NodeNetworks",
                newName: "NetworkID");

            migrationBuilder.RenameColumn(
                name: "time_of_creation",
                table: "NodeNetworks",
                newName: "TimeOfCreation");

            migrationBuilder.CreateIndex(
                name: "IX_Nodes_NodeNetworkNetworkID",
                table: "Nodes",
                column: "NodeNetworkNetworkID");

            migrationBuilder.AddForeignKey(
                name: "FK_Nodes_NodeNetworks_NodeNetworkNetworkID",
                table: "Nodes",
                column: "NodeNetworkNetworkID",
                principalTable: "NodeNetworks",
                principalColumn: "NetworkID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
