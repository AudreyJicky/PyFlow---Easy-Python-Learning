
import React, { useState, useEffect } from 'react';
import { Note, NoteCategory, Language } from '../types';
import { translations } from '../translations';
import { Plus, Trash2, Save, FileText, Tag, Filter, Briefcase, Calendar, BookOpen, Info, Users, User } from 'lucide-react';

interface NotebookProps {
    language: string;
}

const MOCK_SHARED_NOTES: Note[] = [
    { id: 's1', title: 'Python List Cheat Sheet', content: 'my_list.append(x)\nmy_list.sort()\nmy_list.reverse()', date: '2023-10-15', tags: ['lists', 'basics'], category: 'Study', authorName: 'Chen (Group A)', isShared: true },
    { id: 's2', title: 'Django Setup Guide', content: 'pip install django\ndjango-admin startproject myproject', date: '2023-10-18', tags: ['web', 'django'], category: 'Work', authorName: 'Anna (Group B)', isShared: true },
];

const Notebook: React.FC<NotebookProps> = ({ language }) => {
    const [viewMode, setViewMode] = useState<'MINE' | 'SHARED'>('MINE');
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [filterCategory, setFilterCategory] = useState<NoteCategory | 'All'>('All');
    
    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState<NoteCategory>('Study');

    const currentLang = language as Language;
    const t = translations[currentLang]?.notebook || translations['English'].notebook;

    useEffect(() => {
        const saved = localStorage.getItem('pyflow-notes');
        if (saved) {
            setNotes(JSON.parse(saved));
        }
    }, []);

    const saveToLocal = (updatedNotes: Note[]) => {
        localStorage.setItem('pyflow-notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const handleNewNote = () => {
        setViewMode('MINE'); // Switch to my notes
        setIsEditing(true);
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setTagInput('');
        setCategory('Study');
    };

    const handleSave = () => {
        if (!title.trim()) return;

        const newNote: Note = {
            id: selectedNote ? selectedNote.id : Date.now().toString(),
            title,
            content,
            date: new Date().toLocaleDateString(),
            tags: tagInput.split(',').map(t => t.trim()).filter(t => t),
            category,
            isShared: false
        };

        let updatedNotes;
        if (selectedNote) {
            updatedNotes = notes.map(n => n.id === newNote.id ? newNote : n);
        } else {
            updatedNotes = [newNote, ...notes];
        }

        saveToLocal(updatedNotes);
        setIsEditing(false);
        setSelectedNote(newNote); // Select the saved note
    };

    const handleDelete = (id: string) => {
        if (viewMode === 'SHARED') return; // Cannot delete shared notes
        const updated = notes.filter(n => n.id !== id);
        saveToLocal(updated);
        if (selectedNote?.id === id) {
            setSelectedNote(null);
            setIsEditing(false);
        }
    };

    const handleSelect = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
        setTitle(note.title);
        setContent(note.content);
        setTagInput(note.tags.join(', '));
        setCategory(note.category || 'Study');
    };

    const activeNotes = viewMode === 'MINE' ? notes : MOCK_SHARED_NOTES;
    const filteredNotes = filterCategory === 'All' 
        ? activeNotes 
        : activeNotes.filter(n => n.category === filterCategory);

    const categories: NoteCategory[] = ['Study', 'Work', 'Daily', 'Info'];
    
    const getCategoryIcon = (cat: NoteCategory) => {
        switch(cat) {
            case 'Work': return <Briefcase className="w-3 h-3" />;
            case 'Daily': return <Calendar className="w-3 h-3" />;
            case 'Info': return <Info className="w-3 h-3" />;
            default: return <BookOpen className="w-3 h-3" />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-white flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-500 rtl:ml-2 rtl:mr-0" /> {viewMode === 'MINE' ? t.title : t.sharedTitle}
                        </h3>
                        <div className="flex gap-2">
                             {/* View Switcher */}
                             <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
                                <button onClick={() => setViewMode('MINE')} className={`p-1.5 rounded-md ${viewMode === 'MINE' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-400'}`}>
                                    <User className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('SHARED')} className={`p-1.5 rounded-md ${viewMode === 'SHARED' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-400'}`}>
                                    <Users className="w-4 h-4" />
                                </button>
                             </div>

                            <button 
                                onClick={handleNewNote}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                title={t.newNote}
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Category Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         <button 
                            onClick={() => setFilterCategory('All')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                filterCategory === 'All' 
                                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
                                : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                            }`}
                        >
                            {t.all}
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                                    filterCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600'
                                }`}
                            >
                                {getCategoryIcon(cat)} {t.categories[cat]}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50 dark:bg-slate-900/50">
                    {filteredNotes.length === 0 && (
                        <div className="text-center text-slate-400 dark:text-slate-200 p-8 text-sm flex flex-col items-center">
                            <Filter className="w-8 h-8 mb-2 opacity-20" />
                            {t.empty}
                        </div>
                    )}
                    {filteredNotes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => handleSelect(note)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                selectedNote?.id === note.id 
                                ? 'bg-white dark:bg-slate-700 border-blue-500 dark:border-blue-400 shadow-md ring-1 ring-blue-500/20' 
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{note.title}</h4>
                                {note.category && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                                        note.category === 'Work' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                                        note.category === 'Daily' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                        note.category === 'Info' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                    }`}>
                                        {t.categories[note.category]}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-400 justify-between mt-2">
                                <span>{note.date}</span>
                                <div className="flex gap-1">
                                    {note.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {note.isShared && (
                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                    <Users className="w-3 h-3 mr-1" /> {t.sharedBy} {note.authorName}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
                {isEditing || selectedNote ? (
                    <>
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                            {isEditing ? (
                                <input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t.titlePlaceholder}
                                    className="text-lg font-bold text-slate-900 dark:text-white outline-none w-full bg-transparent placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                            ) : (
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedNote?.title}</h2>
                                    {selectedNote?.isShared && (
                                        <p className="text-xs text-blue-500 flex items-center mt-1">
                                            <Users className="w-3 h-3 mr-1" /> Shared by {selectedNote.authorName}
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4">
                                {isEditing ? (
                                    <button onClick={handleSave} className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                                        <Save className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t.save}
                                    </button>
                                ) : (
                                    <>
                                        {!selectedNote?.isShared && (
                                            <>
                                                <button onClick={() => { setIsEditing(true); }} className="text-sm text-blue-600 dark:text-blue-400 font-medium px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                                    {t.edit}
                                                </button>
                                                <button onClick={() => selectedNote && handleDelete(selectedNote.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
                                <div className="flex items-center">
                                    <Tag className="w-4 h-4 text-slate-400 mr-2 rtl:ml-2 rtl:mr-0" />
                                    <input 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder={t.tagsPlaceholder}
                                        className="bg-transparent text-sm w-full outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                                                category === cat 
                                                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-white font-bold'
                                                : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 hover:border-slate-400'
                                            }`}
                                        >
                                            {t.categories[cat]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 relative bg-white dark:bg-slate-800">
                            {isEditing ? (
                                <textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={t.contentPlaceholder}
                                    className="w-full h-full p-6 outline-none resize-none text-slate-800 dark:text-white bg-transparent font-mono text-sm leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                            ) : (
                                <div className="p-6 overflow-y-auto h-full text-slate-800 dark:text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                    {selectedNote?.category && (
                                        <div className="mb-4">
                                             <span className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                {getCategoryIcon(selectedNote.category)} 
                                                <span className="ml-1 rtl:mr-1 rtl:ml-0">{t.categories[selectedNote.category]}</span>
                                            </span>
                                        </div>
                                    )}
                                    {selectedNote?.content}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-500">
                        <FileText className="w-20 h-20 mb-4 opacity-50 dark:opacity-80" />
                        <p className="text-lg font-medium text-slate-500 dark:text-white">{t.selectPrompt}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notebook;
