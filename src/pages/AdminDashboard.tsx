
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Download, LogOut, Plus, Trash2, MessageCircle, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/hooks/useNotes';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { notes, loading, createNote, deleteNote, archiveNote, unarchiveNote } = useNotes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      return;
    }

    await createNote(newNoteTitle, newNoteContent);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleArchiveNote = async (noteId: string) => {
    await archiveNote(noteId);
  };

  const handleUnarchiveNote = async (noteId: string) => {
    await unarchiveNote(noteId);
  };

  const activeNotes = notes.filter(note => !note.archived);
  const archivedNotes = notes.filter(note => note.archived);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 mx-auto text-primary fill-primary animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Love Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Create New Love Note</DialogTitle>
              <DialogDescription>
                Write a beautiful love note to share daily reminders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="content">Love Note Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your heartfelt message here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[150px] border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Recipient Name</Label>
                <Input
                  id="title"
                  placeholder="e.g., Regine Tapado 💖"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="border-border focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreateNote}
              >
                Create Love Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            {activeNotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No active notes. Create your first love note!
              </div>
            ) : (
              activeNotes.map((note) => (
                <div key={note.id} className="bg-card rounded-2xl shadow-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-script text-primary">{note.title}</h3>
                    <p className="text-sm text-muted-foreground">{note.timestamp}</p>
                    <p className="text-foreground mt-2">{note.content}</p>
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

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-muted text-muted-foreground hover:bg-muted/10"
                      onClick={() => handleArchiveNote(note.id)}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4 mt-6">
            {archivedNotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No archived notes
              </div>
            ) : (
              archivedNotes.map((note) => (
                <div key={note.id} className="bg-card rounded-2xl shadow-lg p-6 space-y-4 opacity-75">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-script text-primary">{note.title}</h3>
                    <p className="text-sm text-muted-foreground">{note.timestamp}</p>
                    <p className="text-foreground mt-2">{note.content}</p>
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

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      onClick={() => handleUnarchiveNote(note.id)}
                    >
                      <ArchiveRestore className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}