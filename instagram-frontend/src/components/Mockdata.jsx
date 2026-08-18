// Mockdata.js
// TEMPORARY mock data for the Message page.
// Once your Java/Spring backend is ready, delete this file and replace the
// calls in Messages.jsx with real calls to your services (see Services/ folder), e.g.:
//   GET  /api/conversations                 -> list of conversations for logged-in user
//   GET  /api/conversations/:id/messages     -> messages in a conversation
//   POST /api/conversations/:id/messages     -> send a new message
//
// Keep the SAME shape below so you don't have to rewrite the components,
// just swap out where the data comes from (e.g. create a messageService.js
// in your Services folder, similar to postService.js / userService.js).

export const CURRENT_USER = {
  id: "u1",
  username: "you",
  avatar: "https://i.pravatar.cc/150?img=12",
};

export const conversations = [
  {
    id: "c1",
    user: {
      id: "u2",
      username: "ariana.codes",
      avatar: "https://i.pravatar.cc/150?img=5",
      isOnline: true,
    },
    lastMessage: "That looks amazing! 🔥",
    lastMessageTime: "2m",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "u2", text: "Hey! How's the project going?", time: "10:01 AM", seen: true },
      { id: "m2", senderId: "u1", text: "Pretty good, just finishing the UI", time: "10:02 AM", seen: true },
      { id: "m3", senderId: "u2", text: "That looks amazing! 🔥", time: "10:03 AM", seen: false },
    ],
  },
  {
    id: "c2",
    user: {
      id: "u3",
      username: "dev_rahul",
      avatar: "https://i.pravatar.cc/150?img=8",
      isOnline: false,
    },
    lastMessage: "You: Sent a photo",
    lastMessageTime: "1h",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "u3", text: "Bro send the design file", time: "9:00 AM", seen: true },
      { id: "m2", senderId: "u1", text: "Sent a photo", time: "9:05 AM", seen: true, isImage: true },
    ],
  },
  {
    id: "c3",
    user: {
      id: "u4",
      username: "priya_designs",
      avatar: "https://i.pravatar.cc/150?img=9",
      isOnline: true,
    },
    lastMessage: "Let's connect tomorrow",
    lastMessageTime: "3h",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "u4", text: "Let's connect tomorrow", time: "Yesterday", seen: true },
    ],
  },
  {
    id: "c4",
    user: {
      id: "u5",
      username: "travel_with_me",
      avatar: "https://i.pravatar.cc/150?img=15",
      isOnline: false,
    },
    lastMessage: "Haha true 😂",
    lastMessageTime: "1d",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "u5", text: "Haha true 😂", time: "Yesterday", seen: true },
    ],
  },
];