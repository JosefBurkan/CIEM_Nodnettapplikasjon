using CIEM_Nodnettapplikasjon.Server.Models.Users;
using Microsoft.AspNetCore.SignalR;

namespace CIEM_Nodnettapplikasjon.Server.EmkoreHub
{

/// <summary>
/// Notify all users when the User table's data changes
/// </summary>
public class EmkoreHub : Hub
{
    public async Task SendUsersUpdate(List<UserModel> users)
    {
        await Clients.All.SendAsync("ReceiveUsers", users);
    }
}




}