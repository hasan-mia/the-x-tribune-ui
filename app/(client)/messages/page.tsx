"use client"

import { useState } from 'react'
import { Send, Search, MoreVertical, Paperclip, Phone, Video, Check, CheckCheck } from 'lucide-react'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [messageText, setMessageText] = useState('')

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Tax Advisor',
      avatar: 'SJ',
      lastMessage: 'I will send you the year-end summary tomorrow',
      timestamp: '2 hours ago',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Account Manager',
      avatar: 'MC',
      lastMessage: 'Your quarterly review is scheduled for Jan 22',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: 'Finance Team',
      role: 'Department',
      avatar: 'FT',
      lastMessage: 'Invoice #INV-2025-001 has been created',
      timestamp: '3 days ago',
      unread: 0,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      text: 'Hi! I wanted to follow up on your tax planning for the upcoming fiscal year.',
      timestamp: '10:30 AM',
      isOwn: false,
      read: true,
    },
    {
      id: 2,
      sender: 'You',
      text: "Thanks for reaching out! I'm ready to discuss Q4 tax strategy and any optimization opportunities.",
      timestamp: '10:35 AM',
      isOwn: true,
      read: true,
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      text: 'Perfect. I will send you the year-end summary tomorrow morning with all the relevant documentation.',
      timestamp: '10:40 AM',
      isOwn: false,
      read: true,
    },
  ]

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Secure communication with your financial team</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-0 h-[650px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-scroll md:overflow-hidden">
          {/* Conversation List */}
          <div className="h-full flex flex-col border-r border-slate-200 lg:col-span-1">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-0 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-all flex items-start gap-3 ${selectedConversation === conv.id
                    ? 'bg-blue-50/70 border-l-2 border-l-blue-600'
                    : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${selectedConversation === conv.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                      <span className="font-medium text-sm">{conv.avatar}</span>
                    </div>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`font-medium text-sm ${selectedConversation === conv.id ? 'text-blue-900' : 'text-slate-900'}`}>
                        {conv.name}
                      </p>
                      <span className="text-xs text-slate-400">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{conv.role}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500 truncate pr-2">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="h-full flex flex-col lg:col-span-2">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="font-medium text-sm">{selectedConv?.avatar}</span>
                  </div>
                  {selectedConv?.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">{selectedConv?.name}</h2>
                  <p className="text-xs text-slate-500">{selectedConv?.online ? 'Online' : 'Offline'} · {selectedConv?.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                  <Video className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              <div className="flex justify-center">
                <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
              </div>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md ${msg.isOwn ? 'order-1' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${msg.isOwn
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-100'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1.5 ${msg.isOwn ? 'justify-end' : ''}`}>
                      <span className={`text-xs ${msg.isOwn ? 'text-slate-400' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                      {msg.isOwn && (
                        <CheckCheck className={`h-3.5 w-3.5 ${msg.read ? 'text-blue-500' : 'text-slate-300'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-3 items-center">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && messageText.trim()) {
                      setMessageText('')
                    }
                  }}
                />
                <button
                  className={`p-2.5 rounded-xl transition-all ${messageText.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                    }`}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}