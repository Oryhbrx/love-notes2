import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Reply {
  id: string;
  content: string;
  timestamp: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  replies: Reply[];
  archived: boolean;
  createdAt: Timestamp;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        setNotes(notesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notes',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const createNote = async (title: string, content: string) => {
    try {
      const timestamp = new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      await addDoc(collection(db, 'notes'), {
        title,
        content,
        timestamp,
        replies: [],
        archived: false,
        createdAt: Timestamp.now()
      });

      toast({
        title: 'Love Note Created! 💖',
        description: 'Your new love note has been created',
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, updates);
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive',
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast({
        title: 'Note Deleted',
        description: 'The love note has been removed',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const archiveNote = async (noteId: string) => {
    try {
      await updateNote(noteId, { archived: true });
      toast({
        title: 'Note Archived',
        description: 'The love note has been archived',
      });
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const unarchiveNote = async (noteId: string) => {
    try {
      await updateNote(noteId, { archived: false });
      toast({
        title: 'Note Restored',
        description: 'The love note has been restored',
      });
    } catch (error) {
      console.error('Error unarchiving note:', error);
    }
  };

  const addReply = async (noteId: string, content: string) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      const newReply: Reply = {
        id: Date.now().toString(),
        content,
        timestamp: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };

      await updateNote(noteId, {
        replies: [...note.replies, newReply]
      });

      toast({
        title: 'Reply Sent! 💕',
        description: 'Your reply has been added',
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive',
      });
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    addReply
  };
}
