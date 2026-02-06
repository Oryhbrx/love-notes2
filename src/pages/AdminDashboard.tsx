
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Download, LogOut, Plus, Trash2, MessageCircle, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Note {
  id: number;
  title: string;
  timestamp: string;
  replies: Reply[];
  archived: boolean;
}

interface Reply {
  id: number;
  content: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Regine Tapado 💖',
      timestamp: 'Feb 6, 2026, 5:10 PM',
      replies: [
        { id: 1, content: '😍', timestamp: 'Feb 6, 2026, 5:10 PM' }
      ],
      archived: false
    }
  ]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleDeleteNote = (noteId: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const activeNotes = notes.filter(note => !note.archived);
  const archivedNotes = notes.filter(note => note.archived);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-12 h-12 text-primary fill-primary" />
            <div>
              <h1 className="text-4xl font-serif text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your love notes</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Screenshot
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Create New Note Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Love Note
        </Button>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-primary/20">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Active Notes ({activeNotes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="archived"
              className="data-[state=active]:bg-muted data-[state=active]:text-muted-foreground"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archived ({archivedNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeNotes.map((note) => (
              <div key={note.id} className="bg-card rounded-2xl shadow-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-script text-primary">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">{note.timestamp}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Replies ({note.replies.length})</span>
                  </div>
                  
                  {note.replies.map((reply) => (
                    <div key={reply.id} className="bg-secondary/30 rounded-xl p-3 space-y-1">
                      <p className="text-lg">{reply.content}</p>
                      <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              No archived notes
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}