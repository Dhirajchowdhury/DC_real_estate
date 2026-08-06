"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaUploader, UploadedMedia } from '../operations/MediaUploader';
import { apiClient } from '@/lib/api/apiClient';
import { useRouter } from 'next/navigation';

export function PropertyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [tempPropertyId] = useState(() => Math.random().toString(36).substring(7));

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FLAT',
    price: '',
    location: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '3',
    bathrooms: '2',
    areaSqFt: '1200',
  });

  const handleUploadComplete = (newMedia: UploadedMedia) => {
    setMedia(prev => [...prev, newMedia]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: Number(formData.price),
        location: formData.location,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        media: media.map(m => ({
          url: m.url,
          mediaType: m.mediaType,
          fileName: m.fileName,
          mimeType: m.mimeType,
          fileSize: m.fileSize
        }))
      };

      await apiClient.post('/public/properties', payload);
      alert('Property published successfully!');
      router.push('/properties');
    } catch (err: any) {
      console.error('Failed to save property:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit property. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Enter the primary details for the property.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="Luxury Villa at Rajarhat..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="FLAT">Apartment / Flat</option>
                <option value="VILLA">Villa</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (INR)</label>
              <input 
                type="number" 
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="6500000" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Area (Sq Ft)</label>
              <input 
                type="number" 
                name="areaSqFt"
                required
                value={formData.areaSqFt}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="1450" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedrooms</label>
              <input 
                type="number" 
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <input 
                type="number" 
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-background" 
              placeholder="Describe the main highlights and details..." 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Specify the address and region of the property.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Street / Location</label>
            <input 
              type="text" 
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-background" 
              placeholder="Action Area II, Rajarhat" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input 
                type="text" 
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="Kolkata" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <input 
                type="text" 
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="West Bengal" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zip Code</label>
              <input 
                type="text" 
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="700156" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Gallery</CardTitle>
          <CardDescription>Upload photos and videos of the property. Media will be automatically optimized before upload.</CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUploader 
            propertyId={tempPropertyId} 
            onUploadComplete={handleUploadComplete} 
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Property...' : 'Save & Publish Property'}
        </Button>
      </div>
    </form>
  );
}
