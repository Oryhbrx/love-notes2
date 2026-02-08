
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BellOff, Bell, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNotes } from '@/hooks/useNotes';

export default function Index() {
  const [reply, setReply] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();
  const { notes, loading, addReply } = useNotes();

  // Get the most recent active note
  const currentNote = notes.find(note => !note.archived);

  useEffect(() => {
    // Check if notifications are already enabled
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Notifications are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      
      // Send a test notification immediately
      new Notification('Love Notes for Regine 💖', {
        body: 'Notifications are working! You will receive daily reminders ❤️',
        icon: '/heart-icon.png',
        tag: 'love-note-test',
        requireInteraction: false,
      });
      
      toast({
        title: 'Test Notification Sent! 💖',
        description: 'Check your system notifications',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      
      // Send a test notification
      new Notification('Love Notes for Regine 💖', {
        body: 'Notifications enabled! You will receive daily reminders ❤️',
        icon: '/heart-icon.png',
        tag: 'love-note-welcome',
        requireInteraction: false,
      });
      
      toast({
        title: 'Notifications Enabled! 💖',
        description: 'Check your system notifications for a test message',
      });
    } else if (permission === 'denied') {
      toast({
        title: 'Permission Denied',
        description: 'Please enable notifications in your browser settings',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Permission Dismissed',
        description: 'Click the button again to enable notifications',
      });
    }
  };

  const handleSendReply = async () => {
    if (reply.trim() && currentNote) {
      await addReply(currentNote.id, reply);
      setReply('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary fill-primary animate-pulse" />
          <p className="text-muted-foreground">Loading love notes...</p>
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary fill-primary" />
          <h1 className="text-3xl font-serif text-foreground">No Love Notes Yet</h1>
          <p className="text-muted-foreground">Check back soon for your daily reminder! ❤️</p>
          <Link to="/admin/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary fill-primary" />
          <h1 className="text-4xl font-serif text-foreground">Love Notes for Regine</h1>
          <p className="text-muted-foreground">Your daily reminder ❤️</p>
        </div>

        {/* Enable Notifications Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary/10 rounded-full px-8"
            onClick={handleEnableNotifications}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Notifications Enabled
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Enable Notifications
              </>
            )}
          </Button>
        </div>

        {/* Love Note Card */}
        <div className="bg-card rounded-2xl shadow-lg p-8 space-y-6">
          {/* Note Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-script text-primary">{currentNote.title}</h2>
            <p className="text-sm text-muted-foreground">{currentNote.timestamp}</p>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Your Replies:</h3>
            
            {currentNote.replies.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No replies yet. Be the first to reply! 💕</p>
            ) : (
              currentNote.replies.map((r) => (
                <div key={r.id} className="bg-secondary/30 rounded-xl p-4 space-y-1">
                  <p className="text-lg">{r.content}</p>
                  <p className="text-xs text-muted-foreground">{r.timestamp}</p>
                </div>
              ))
            )}

            {/* Reply Input */}
            <div className="relative">
              <Textarea
                placeholder="Write your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="min-h-[100px] pr-16 resize-none border-border focus:ring-primary"
              />
              <Button
                size="icon"
                className="absolute bottom-4 right-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSendReply}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <Link 
            to="/admin/login" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}