
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication
    if (password === 'admin') {
      navigate('/admin/dashboard');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 mx-auto text-primary fill-primary" />
          <h1 className="text-3xl font-serif text-foreground">Admin Login</h1>
          <p className="text-muted-foreground">Enter password to manage love notes</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl shadow-lg p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="border-border focus:ring-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}