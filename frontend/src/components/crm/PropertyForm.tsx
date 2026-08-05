import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaUploader, UploadedMedia } from '../operations/MediaUploader';
// import axios from 'axios'; // For future API integration

export function PropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  // Use a temporary ID for media upload paths before saving
  const [tempPropertyId] = useState(() => Math.random().toString(36).substring(7));

  const handleUploadComplete = (newMedia: UploadedMedia) => {
    setMedia(prev => [...prev, newMedia]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct property data with media
    const propertyData = {
      // ... other form fields
      media
    };

    console.log('Submitting property data:', propertyData);
    
    // Simulate API call
    setTimeout(() => {
      alert('Property saved with ' + media.length + ' media items! (Mock submission)');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Enter the primary details for the property.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input type="text" className="w-full p-2 border rounded-md bg-background" placeholder="Luxury Villa..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input type="number" className="w-full p-2 border rounded-md bg-background" placeholder="5000000" />
            </div>
          </div>
          {/* Add more fields as needed */}
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
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Property'}
        </Button>
      </div>
    </form>
  );
}
