
import React, { useState } from 'react';
import { explainTopic } from '../services/geminiService';
import { ReferenceTopic, Language } from '../types';
import { translations } from '../translations';
import { Book, ChevronRight, Loader2, Star, Shield, Crown, Coffee, GraduationCap, Briefcase, Code, Sparkles } from 'lucide-react';

interface ReferenceBookProps {
    language: Language;
}

interface TopicSection {
    id: string;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Professional' | 'Practical';
    icon: React.ReactNode;
    color: string;
    topics: ReferenceTopic[];
}

// --- ZERO LATENCY CONTENT DATABASE ---
const STATIC_CONTENT: Record<string, string> = {
    // Novice
    '1': `# Variables\nVariables are containers for storing data values.\n\n### Creating Variables\nPython has no command for declaring a variable. A variable is created the moment you first assign a value to it.\n\n\`\`\`python\nx = 5\ny = "John"\nprint(x)\nprint(y)\n\`\`\`\n\n### Casting\nIf you want to specify the data type of a variable, this can be done with casting.\n\n\`\`\`python\nx = str(3)    # x will be '3'\ny = int(3)    # y will be 3\nz = float(3)  # z will be 3.0\n\`\`\``,
    '2': `# Data Types\nVariables can store data of different types, and different types can do different things.\n\n### Built-in Data Types\n* **Text Type:** \`str\`\n* **Numeric Types:** \`int\`, \`float\`, \`complex\`\n* **Sequence Types:** \`list\`, \`tuple\`, \`range\`\n* **Mapping Type:** \`dict\`\n* **Set Types:** \`set\`, \`frozenset\`\n* **Boolean Type:** \`bool\`\n\n\`\`\`python\nx = 5        # int\ny = "Hello"  # str\nz = 20.5     # float\n\`\`\``,
    '3': `# Lists\nLists are used to store multiple items in a single variable.\n\n### Creating a List\nLists are created using square brackets:\n\n\`\`\`python\nthislist = ["apple", "banana", "cherry"]\nprint(thislist)\n\`\`\`\n\n### Access Items\nList items are indexed, the first item has index [0], the second item has index [1] etc.\n\n\`\`\`python\nprint(thislist[1]) # Output: banana\n\`\`\``,
    '4': `# Loops\nPython has two primitive loop commands: \`while\` loops and \`for\` loops.\n\n### The For Loop\nA for loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).\n\n\`\`\`python\nfruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n  print(x)\n\`\`\`\n\n### The Range() Function\nTo loop through a set of code a specified number of times, we can use the range() function,\n\n\`\`\`python\nfor x in range(6):\n  print(x) # Prints 0 to 5\n\`\`\``,
    '5': `# Conditionals\nPython supports the usual logical conditions from mathematics.\n\n### If Statement\n\n\`\`\`python\na = 33\nb = 200\nif b > a:\n  print("b is greater than a")\n\`\`\`\n\n### Elif\nThe elif keyword is Python's way of saying "if the previous conditions were not true, then try this condition".\n\n\`\`\`python\na = 33\nb = 33\nif b > a:\n  print("b is greater than a")\nelif a == b:\n  print("a and b are equal")\n\`\`\``,
    
    // Apprentice
    '6': `# Functions\nA function is a block of code which only runs when it is called.\n\n### Creating a Function\nIn Python a function is defined using the \`def\` keyword:\n\n\`\`\`python\ndef my_function():\n  print("Hello from a function")\n\`\`\`\n\n### Calling a Function\nTo call a function, use the function name followed by parenthesis:\n\n\`\`\`python\nmy_function()\n\`\`\``,
    '7': `# Dictionaries\nDictionaries are used to store data values in key:value pairs.\n\n### Creating a Dictionary\nA dictionary is a collection which is ordered*, changeable and does not allow duplicates.\n\n\`\`\`python\nthisdict = {\n  "brand": "Ford",\n  "model": "Mustang",\n  "year": 1964\n}\nprint(thisdict["brand"])\n\`\`\``,
    '8': `# File Handling\nFile handling is an important part of any web application.\n\n### Open a File\nThe key function for working with files in Python is the \`open()\` function.\n\n\`\`\`python\nf = open("demofile.txt", "r")\nprint(f.read())\n\`\`\`\n\n### Write to File\n\n\`\`\`python\nf = open("demofile.txt", "a")\nf.write("Now the file has more content!")\nf.close()\n\`\`\``,
    '9': `# Error Handling\nThe \`try\` block lets you test a block of code for errors.\nThe \`except\` block lets you handle the error.\n\n\`\`\`python\ntry:\n  print(x)\nexcept:\n  print("An exception occurred")\n\`\`\`\n\n### Finally\nThe \`finally\` block, if specified, will be executed regardless if the try block raises an error or not.`,
    '10': `# Modules\nConsider a module to be the same as a code library.\n\n### Create a Module\nTo create a module just save the code you want in a file with the file extension \`.py\`.\n\n### Use a Module\nNow we can use the module we just created, by using the \`import\` statement:\n\n\`\`\`python\nimport mymodule\n\nmymodule.greeting("Jonathan")\n\`\`\``,
    '11': `# Classes/Objects\nPython is an object oriented programming language.\n\n### Create a Class\nTo create a class, use the keyword \`class\`:\n\n\`\`\`python\nclass MyClass:\n  x = 5\n\np1 = MyClass()\nprint(p1.x)\n\`\`\`\n\n### The __init__() Function\nAll classes have a function called __init__(), which is always executed when the class is being initiated.\n\n\`\`\`python\nclass Person:\n  def __init__(self, name, age):\n    self.name = name\n    self.age = age\n\np1 = Person("John", 36)\nprint(p1.name)\n\`\`\``,

    // Grandmaster
    '12': `# Decorators\nDecorators are a very powerful and useful tool in Python since it allows programmers to modify the behaviour of a function or class.\n\n\`\`\`python\ndef my_decorator(func):\n    def wrapper():\n        print("Something is happening before the function is called.")\n        func()\n        print("Something is happening after the function is called.")\n    return wrapper\n\n@my_decorator\ndef say_whee():\n    print("Whee!")\n\`\`\``,
    '13': `# Generators\nGenerators are a simple way of creating iterators.\n\n### Yield\nIt creates a function that yields results one by one, rather than returning them all at once.\n\n\`\`\`python\ndef my_gen():\n    n = 1\n    print('This is printed first')\n    yield n\n\n    n += 1\n    print('This is printed second')\n    yield n\n\nfor item in my_gen():\n    print(item)\n\`\`\``,
    '14': `# Context Managers\nContext managers allow you to allocate and release resources precisely when you want to.\n\n### The 'with' statement\nThe most common use is opening files:\n\n\`\`\`python\nwith open('some_file', 'w') as opened_file:\n    opened_file.write('Hola!')\n\`\`\`\n\nThis ensures the file is closed automatically, even if an error occurs.`,
    '15': `# Concurrency\nPython can run tasks in parallel using Threading or Asyncio.\n\n### Asyncio\n\n\`\`\`python\nimport asyncio\n\nasync def main():\n    print('Hello ...')\n    await asyncio.sleep(1)\n    print('... World!')\n\nasyncio.run(main())\n\`\`\``,
    '16': `# Metaprogramming\nMetaprogramming is code that manipulates code.\n\n### Type()\n\`type()\` can be used to create classes dynamically.\n\n\`\`\`python\nMyClass = type('MyClass', (object,), {'x': 5})\nm = MyClass()\nprint(m.x) # 5\n\`\`\``,
    '17': `# Design Patterns\nCommon solutions to common problems.\n\n### Singleton\nEnsures a class has only one instance.\n\n\`\`\`python\nclass Singleton:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\`\`\``,

    // Practical
    'd1': `# Automating Chores\nUse Python to do boring tasks.\n\n### Renaming Files\n\n\`\`\`python\nimport os\n\nfolder = "photos/"\nfor count, filename in enumerate(os.listdir(folder)):\n    dst = f"vacation_{str(count)}.jpg"\n    src =f"{folder}/{filename}"\n    dst =f"{folder}/{dst}"\n    os.rename(src, dst)\n\`\`\``,
    'd2': `# Organizing Files\nMove files based on extension.\n\n\`\`\`python\nimport shutil\nimport os\n\nfor file in os.listdir('.'):\n    if file.endswith('.pdf'):\n        shutil.move(file, 'documents/')\n\`\`\``,
    'd3': `# Sending Emails\nUse \`smtplib\` to send emails.\n\n\`\`\`python\nimport smtplib\n\ns = smtplib.SMTP('smtp.gmail.com', 587)\ns.starttls()\ns.login("sender@gmail.com", "password")\ns.sendmail("sender", "receiver", "Subject: Hi\\n\\nThis is a test.")\ns.quit()\n\`\`\``,
    's1': `# Math Solver\nUse \`sympy\` for symbolic mathematics.\n\n\`\`\`python\nfrom sympy import symbols, solve\n\nx = symbols('x')\nexpr = x**2 - 4\nsol = solve(expr)\nprint(sol) # [-2, 2]\n\`\`\``,
    's2': `# Plotting Graphs\nUse \`matplotlib\` for visualization.\n\n\`\`\`python\nimport matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [10, 20, 25, 30]\n\nplt.plot(x, y)\nplt.show()\n\`\`\``,
    's3': `# Flashcard Maker\nRead a CSV and quiz yourself.\n\n\`\`\`python\nimport pandas as pd\n\ndf = pd.read_csv('vocab.csv')\nrow = df.sample()\nprint(row['Front'].values[0])\ninput("Press Enter...")\nprint(row['Back'].values[0])\n\`\`\``,
    'w1': `# Excel Automation\nUse \`openpyxl\` or \`pandas\`.\n\n\`\`\`python\nimport pandas as pd\n\ndf = pd.read_excel('sales.xlsx')\nprint(df.groupby('Region').sum())\n\`\`\``,
    'w2': `# Web Scraping\nUse \`BeautifulSoup\`.\n\n\`\`\`python\nimport requests\nfrom bs4 import BeautifulSoup\n\npage = requests.get("http://example.com")\nsoup = BeautifulSoup(page.content, 'html.parser')\nprint(soup.title.text)\n\`\`\``,
    'w3': `# PDF Manipulation\nUse \`PyPDF2\`.\n\n\`\`\`python\nfrom PyPDF2 import PdfReader\n\nreader = PdfReader("book.pdf")\npage = reader.pages[0]\nprint(page.extract_text())\n\`\`\``,
    'c1': `# One-Liners\nPythonic shortcuts.\n\n**Swap variables:**\n\`a, b = b, a\`\n\n**Reverse list:**\n\`my_list[::-1]\`\n\n**List Comprehension:**\n\`[x**2 for x in range(10)]\`\n`,
    'c2': `# Regex Cheat Sheet\nRegular Expressions.\n\n* \`\\d\`: Digit\n* \`\\w\`: Word character\n* \`.\`: Any character\n* \`^\`: Start of string\n* \`$\`: End of string\n* \`*\`: Zero or more\n* \`+\`: One or more\n\n\`\`\`python\nimport re\nx = re.findall("\\d+", "There are 2 apples and 5 oranges")\nprint(x) # ['2', '5']\n\`\`\``,
    'c3': `# Algorithms\n\n### Bubble Sort\n\n\`\`\`python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1] :\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n\`\`\``
};

const ReferenceBook: React.FC<ReferenceBookProps> = ({ language }) => {
    const [selectedTopic, setSelectedTopic] = useState<ReferenceTopic | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('Beginner');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    
    const t = translations[language].reference;

    // Expanded Topics List with Dynamic Translations
    const SECTIONS: TopicSection[] = [
        {
            id: 'novice',
            title: t.sections?.novice || 'Novice (Beginner)',
            level: 'Beginner',
            icon: <Star className="w-5 h-5" />,
            color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
            topics: [
                { id: '1', title: t.topics?.variables || 'Variables', emoji: '📦', description: t.desc?.variables || 'Storing data' },
                { id: '2', title: t.topics?.datatypes || 'Data Types', emoji: '🔢', description: t.desc?.datatypes || 'Strings, Ints' },
                { id: '3', title: t.topics?.lists || 'Lists', emoji: '📜', description: t.desc?.lists || 'Collections' },
                { id: '4', title: t.topics?.loops || 'Loops', emoji: '🔄', description: t.desc?.loops || 'Repetition' },
                { id: '5', title: t.topics?.conditionals || 'Conditionals', emoji: '🔀', description: t.desc?.conditionals || 'Logic' },
            ]
        },
        {
            id: 'apprentice',
            title: t.sections?.apprentice || 'Apprentice (Intermediate)',
            level: 'Intermediate',
            icon: <Shield className="w-5 h-5" />,
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
            topics: [
                { id: '6', title: t.topics?.functions || 'Functions & Scope', emoji: '⚡', description: 'Reusable code blocks' },
                { id: '7', title: t.topics?.dictionaries || 'Dictionaries & Sets', emoji: '📖', description: 'Hash maps and unique sets' },
                { id: '8', title: t.topics?.files || 'File Handling', emoji: '📂', description: 'Reading/Writing files' },
                { id: '9', title: t.topics?.errors || 'Error Handling', emoji: '⚠️', description: 'Try, Except, Finally' },
                { id: '10', title: t.topics?.modules || 'Modules & Pip', emoji: '📦', description: 'Importing libraries' },
                { id: '11', title: t.topics?.oop || 'OOP Basics', emoji: '🏗️', description: 'Classes and Objects' },
            ]
        },
        {
            id: 'grandmaster',
            title: t.sections?.grandmaster || 'Grandmaster (Professional)',
            level: 'Professional',
            icon: <Crown className="w-5 h-5" />,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
            topics: [
                { id: '12', title: t.topics?.decorators || 'Decorators', emoji: '🎀', description: 'Modifying functions' },
                { id: '13', title: t.topics?.generators || 'Generators', emoji: '🏭', description: 'Yield and memory efficiency' },
                { id: '14', title: t.topics?.context || 'Context Managers', emoji: '🚪', description: 'With statement deep dive' },
                { id: '15', title: t.topics?.concurrency || 'Concurrency', emoji: '⚡', description: 'Asyncio, Threading' },
                { id: '16', title: t.topics?.metaprog || 'Metaprogramming', emoji: '🔮', description: 'Code that writes code' },
                { id: '17', title: t.topics?.patterns || 'Design Patterns', emoji: '📐', description: 'Singleton, Factory, etc.' },
            ]
        },
        // --- NEW PRACTICAL SECTIONS ---
        {
            id: 'daily',
            title: t.sections?.daily || 'Daily Life',
            level: 'Practical',
            icon: <Coffee className="w-5 h-5" />,
            color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
            topics: [
                { id: 'd1', title: t.topics?.chores || 'Automating Chores', emoji: '🤖', description: 'Scripts for daily tasks' },
                { id: 'd2', title: t.topics?.files_org || 'Organizing Files', emoji: '🗂️', description: 'Cleanup your downloads folder' },
                { id: 'd3', title: t.topics?.emails || 'Sending Emails', emoji: '📧', description: 'SMTP automation' },
            ]
        },
        {
            id: 'school',
            title: t.sections?.school || 'School Helper',
            level: 'Practical',
            icon: <GraduationCap className="w-5 h-5" />,
            color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
            topics: [
                { id: 's1', title: t.topics?.math || 'Math Solver', emoji: '➕', description: 'Calculus & Algebra with SymPy' },
                { id: 's2', title: t.topics?.plotting || 'Plotting Graphs', emoji: '📊', description: 'Matplotlib basics' },
                { id: 's3', title: t.topics?.flashmaker || 'Flashcard Maker', emoji: '🃏', description: 'Study tools with Pandas' },
            ]
        },
        {
            id: 'work',
            title: t.sections?.work || 'Work & Office',
            level: 'Practical',
            icon: <Briefcase className="w-5 h-5" />,
            color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
            topics: [
                { id: 'w1', title: t.topics?.excel || 'Excel Automation', emoji: '📉', description: 'OpenPyXL & Pandas' },
                { id: 'w2', title: t.topics?.scraping || 'Web Scraping', emoji: '🕷️', description: 'BeautifulSoup & Selenium' },
                { id: 'w3', title: t.topics?.pdf || 'PDF Manipulation', emoji: '📄', description: 'Merging & splitting PDFs' },
            ]
        },
        {
            id: 'code',
            title: t.sections?.code || 'Code Bank',
            level: 'Practical',
            icon: <Code className="w-5 h-5" />,
            color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
            topics: [
                { id: 'c1', title: t.topics?.oneliners || 'One-Liners', emoji: '⚡', description: 'Powerful single lines' },
                { id: 'c2', title: t.topics?.regex || 'Regex Cheat Sheet', emoji: '🔍', description: 'Pattern matching' },
                { id: 'c3', title: t.topics?.algos || 'Algorithm Snippets', emoji: '🧠', description: 'Sort, Search, Graph' },
            ]
        }
    ];

    const handleTopicClick = async (topic: ReferenceTopic, level: string) => {
        setSelectedTopic(topic);
        setSelectedLevel(level);
        
        // ZERO LATENCY CHECK
        if (STATIC_CONTENT[topic.id]) {
            setContent(STATIC_CONTENT[topic.id]);
            return;
        }

        // Fallback to AI if content is missing (Zero Latency failed)
        setLoading(true);
        setContent('');
        try {
            const explanation = await explainTopic(topic.title, language, level);
            setContent(explanation);
        } catch (e) {
            setContent("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Sidebar Table of Contents */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                        <Book className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" /> {t.basics}
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-6 bg-white dark:bg-slate-800">
                    {/* Core Curriculum Header */}
                    <div className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        {t.sections.core || 'Core Curriculum'}
                    </div>

                    {SECTIONS.slice(0, 3).map((section) => (
                         <div key={section.id}>
                            <div className={`flex items-center px-3 py-2 mb-2 rounded-lg font-bold text-sm uppercase tracking-wider ${section.color}`}>
                                <span className="mr-2 rtl:ml-2 rtl:mr-0">{section.icon}</span>
                                {section.title}
                            </div>
                            <div className="space-y-1 pl-2 rtl:pl-0 rtl:pr-2 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-slate-700">
                                {section.topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicClick(topic, section.level)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group ${
                                            selectedTopic?.id === topic.id
                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <span className="text-xl mr-3 rtl:ml-3 rtl:mr-0 opacity-80">{topic.emoji}</span>
                                            <div className="truncate">
                                                <div className="text-sm truncate">{topic.title}</div>
                                            </div>
                                        </div>
                                        {selectedTopic?.id === topic.id && <ChevronRight className="w-4 h-4 text-blue-500 rtl:rotate-180" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Practical Applications Header */}
                    <div className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {t.sections.practical || 'Practical Applications'}
                    </div>

                    {SECTIONS.slice(3).map((section) => (
                         <div key={section.id}>
                            <div className={`flex items-center px-3 py-2 mb-2 rounded-lg font-bold text-sm uppercase tracking-wider ${section.color}`}>
                                <span className="mr-2 rtl:ml-2 rtl:mr-0">{section.icon}</span>
                                {section.title}
                            </div>
                            <div className="space-y-1 pl-2 rtl:pl-0 rtl:pr-2 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-slate-700">
                                {section.topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicClick(topic, section.level)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group ${
                                            selectedTopic?.id === topic.id
                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <span className="text-xl mr-3 rtl:ml-3 rtl:mr-0 opacity-80">{topic.emoji}</span>
                                            <div className="truncate">
                                                <div className="text-sm truncate">{topic.title}</div>
                                            </div>
                                        </div>
                                        {selectedTopic?.id === topic.id && <ChevronRight className="w-4 h-4 text-blue-500 rtl:rotate-180" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden transition-colors">
                {selectedTopic ? (
                    <>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center">
                                <span className="text-4xl mr-4 rtl:ml-4 rtl:mr-0 shadow-sm rounded-xl p-2 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600">{selectedTopic.emoji}</span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTopic.title}</h2>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                                            selectedLevel === 'Professional' ? 'border-purple-200 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800' :
                                            selectedLevel === 'Intermediate' ? 'border-blue-200 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' :
                                            selectedLevel === 'Practical' ? 'border-green-200 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800' :
                                            'border-yellow-200 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800'
                                        }`}>
                                            {selectedLevel}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedTopic.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-800">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl">🐍</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{t.loading}</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate dark:prose-invert max-w-none 
                                    prose-h1:text-3xl prose-h1:font-extrabold prose-h1:text-slate-900 dark:prose-h1:text-white
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-blue-600 dark:prose-h2:text-blue-400 prose-h2:mt-8
                                    prose-h3:text-xl prose-h3:font-semibold prose-h3:text-slate-800 dark:prose-h3:text-white
                                    prose-p:text-slate-700 dark:prose-p:text-white prose-p:leading-relaxed
                                    prose-strong:text-slate-900 dark:prose-strong:text-white
                                    prose-li:text-slate-700 dark:prose-li:text-white
                                    prose-ul:text-slate-700 dark:prose-ul:text-white
                                    prose-ol:text-slate-700 dark:prose-ol:text-white
                                    prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:shadow-lg
                                " dir="auto">
                                    {content.split('\n').map((line, idx) => {
                                        // Custom renderer for better visuals
                                        if (line.startsWith('# ')) return <h1 key={idx}>{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={idx}>{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('### ')) return <h3 key={idx}>{line.replace('### ', '')}</h3>;
                                        if (line.trim().startsWith('```')) return null; // Skip code fences
                                        if (line.trim().startsWith('print') || line.includes('def ') || line.includes('class ') || line.includes('import ') || line.includes(' = ')) {
                                             // Heuristic for simple code block rendering if the AI didn't format perfectly or for variety
                                            return <div key={idx} className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm my-4 border border-slate-700 shadow-sm overflow-x-auto" dir="ltr">{line}</div>;
                                        }
                                        return <p key={idx} className="text-slate-700 dark:text-white">{line}</p>;
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-white dark:bg-slate-800">
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-full mb-6">
                            <Book className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t.select}</h3>
                        <p className="max-w-sm mx-auto opacity-70">Choose a topic from Novice to Grandmaster, or explore Practical Applications.</p>
                        
                        <div className="mt-8 flex gap-4 opacity-60">
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400"><Coffee className="w-4 h-4" /></span>
                                <span className="text-[10px]">Daily</span>
                            </span>
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400"><GraduationCap className="w-4 h-4" /></span>
                                <span className="text-[10px]">School</span>
                            </span>
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400"><Briefcase className="w-4 h-4" /></span>
                                <span className="text-[10px]">Work</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferenceBook;
