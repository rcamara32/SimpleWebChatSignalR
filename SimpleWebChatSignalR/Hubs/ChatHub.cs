using Microsoft.AspNet.SignalR;
using SimpleWebChatSignalR.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleWebChatSignalR.Hubs
{
    public class ChatHub : Hub
    {

        static List<ChatUsers> SignalRUsers = new List<ChatUsers>();

        public void Connect(string fisrtName, string lastName, string picture)
        {
            var id = Context.ConnectionId;

            if (!SignalRUsers.Any(x => x.ConnectionId == id))
            {
                SignalRUsers.Add(new ChatUsers { ConnectionId = id, FirstName = fisrtName, LastName = lastName, Picture = picture });
            }

            Clients.All.updateUsersList(GetAllActiveConnections());
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var item = SignalRUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                SignalRUsers.Remove(item);
            }

            return base.OnDisconnected(stopCalled);
        }

        public void Send(string fisrtName, string lastName, string picture, string message)
        {
            //SendMessge built in runtime, method client-side
            Clients.All.SendMessage(fisrtName, lastName, picture, message);
        }      

        //return list of all active connections
        public List<ChatUsers> GetAllActiveConnections()
        {
            return SignalRUsers;
        }

    }
}