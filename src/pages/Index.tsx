
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BellOff, Bell, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([
    { id: 1, content: '😍', timestamp: 'Feb 6, 2026, 5:10 PM' }
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: 'Already Enabled',
        description: 'Notifications are already enabled',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      toast({
        title: 'Notifications Enabled! 💖',
        description: 'You will receive daily love note reminders',
      });
      
      // Send a test notification
      new Notification('Love Notes for Regine', {
        body: 'You will receive daily reminders here! ❤️',
        icon: '/heart-icon.png',
      });
    } else {
      toast({
        title: 'Permission Denied',
        description: 'Please enable notifications in your browser settings',
        variant: 'destructive',
      });
    }
  };

  const handleSendReply = () => {
    if (reply.trim()) {
      setReplies([...replies, {
        id: replies.length + 1,
        content: reply,
        timestamp: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }]);
      setReply('');
      toast({
        title: 'Reply Sent! 💕',
        description: 'Your reply has been added',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary fill-primary" />
          <h1 className="text-5xl font-serif text-foreground">Love Notes for Regine</h1>
          <p className="text-muted-foreground text-lg">Your daily reminder ❤️</p>
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
            <h2 className="text-3xl font-script text-primary">Regine Tapado 💖</h2>
            <p className="text-sm text-muted-foreground">Friday, February 6, 2026 at 5:10 PM</p>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Your Replies:</h3>
            
            {replies.map((r) => (
              <div key={r.id} className="bg-secondary/30 rounded-xl p-4 space-y-1">
                <p className="text-lg">{r.content}</p>
                <p className="text-xs text-muted-foreground">{r.timestamp}</p>
              </div>
            ))}

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