import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  PhoneCall, 
  Mail, 
  Send, 
  Bot, 
  User, 
  MessageSquareQuote, 
  Clock 
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function HelpModal() {
  const { helpModalOpen, setHelpModalOpen } = useBooking();

  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am My Bus Booking AI Support Assistant. How can I help with your bus journey today?' }
  ]);
  const [inputText, setInputText] = useState('');

  if (!helpModalOpen) return null;

  const quickQuestions = [
    'How do I cancel my ticket?',
    'Where is my bus live location?',
    'When will I receive my refund?',
    'Are blankets provided in AC sleeper?'
  ];

  const handleSend = (userText) => {
    const query = (userText || inputText).trim();
    if (!query) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInputText('');

    setTimeout(() => {
      let botReply = 'Thank you for reaching out. Our support team is available 24/7. Your query has been noted.';
      const lower = query.toLowerCase();

      if (lower.includes('cancel')) {
        botReply = 'You can cancel any active ticket from the "My Bookings" menu at the top. Cancellation charges will be applied as per the bus operator schedule, and the refund is credited automatically within 48 hours.';
      } else if (lower.includes('where') || lower.includes('live') || lower.includes('location')) {
        botReply = 'For buses with "Live Tracking", an SMS with the live GPS tracker link is dispatched to your registered mobile 30 minutes prior to bus departure.';
      } else if (lower.includes('refund')) {
        botReply = 'All ticket cancellation refunds are processed instantly back to your original source (UPI, Card, or Net Banking) within 1 to 2 business days.';
      } else if (lower.includes('blanket') || lower.includes('amenities')) {
        botReply = 'Yes! All AC Sleeper and Primo buses provide sanitized blankets, water bottles, and clean bed linen for your comfortable journey.';
      }

      setMessages([...newMsgs, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-xs animate-in fade-in duration-200 sm:items-center sm:p-6">
      <div className="my-auto flex max-h-[85dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#087e8b] to-[#075e68] p-4 text-white sm:p-5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Montserrat'] sm:text-lg">My Bus Booking 24/7 Support Assistant</h2>
              <p className="text-xs text-sky-100">Live • Instant Assistance</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHelpModalOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact info bar */}
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-600 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#087e8b]" />
            <span className="font-semibold">Toll-Free: 1800 102 8747</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#087e8b]" />
            <span>support@mybusbooking.in</span>
          </div>
        </div>

        {/* Chat History */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#fbfbfb] p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                m.sender === 'user' ? 'bg-[#087e8b] text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#087e8b] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-xs rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Quick FAQ chips */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Common Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-left text-xs bg-white hover:bg-sky-50 text-gray-700 hover:text-[#087e8b] px-2.5 py-1.5 rounded-xl border border-gray-200 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#087e8b]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-[#087e8b] hover:bg-[#075e68] text-white transition shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
