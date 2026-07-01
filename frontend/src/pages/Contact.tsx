import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Contact Support</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Have clinical feedback or technical questions? Drop us a line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card border rounded-3xl p-6 shadow-md space-y-6">
                <h3 className="font-bold text-md text-foreground">Support Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">support@luminaspeech.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <Phone className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-muted-foreground">+1 (555) 345-6789</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-muted-foreground">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {submitted && (
                <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-2xl border border-emerald-500/20">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-semibold text-sm">Message received. Our clinic team will reply shortly!</span>
                </div>
              )}

              <form onSubmit={handleSend} className="bg-card border rounded-3xl p-6 shadow-md space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/40 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/40 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="msg">
                    Message
                  </label>
                  <textarea
                    id="msg"
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe your question or request..."
                    className="w-full bg-muted/40 border rounded-2xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-2xl shadow hover:bg-primary/90 transition-all active:scale-95 text-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;
export { Contact };
