"use client";

import { useState } from 'react';
import { PublicNavbar } from '@/components/public/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { apiClient } from '@/lib/api/apiClient';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await apiClient.post('/public/inquiry', {
        ...formData,
        type: 'GENERAL'
      });
      setSuccessMsg('Thank you for contacting us! Our team will get back to you shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Have questions about listing a property, purchasing, or partnering with DC Real Estate? Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Details Cards */}
            <div className="space-y-6">
              <Card className="p-2 border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Corporate HQ</h4>
                    <p className="text-muted-foreground text-sm">Action Area II, Rajarhat, Kolkata, WB 700156</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-2 border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                    <p className="text-muted-foreground text-sm">+91 (033) 4000-8800</p>
                    <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-2 border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email Support</h4>
                    <p className="text-muted-foreground text-sm">support@dcrealestate.com</p>
                    <p className="text-muted-foreground text-sm">partners@dcrealestate.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-2 border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Business Hours</h4>
                    <p className="text-muted-foreground text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p className="text-muted-foreground text-sm">Sunday: By Appointment</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-border p-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Send an Inquiry</CardTitle>
                  <CardDescription>Fill out the form below and an agent will respond within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {successMsg && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium">
                      {successMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          name="name"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md bg-background"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-12 text-base font-bold gap-2" disabled={loading}>
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
