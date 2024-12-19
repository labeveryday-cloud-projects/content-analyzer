import React, { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Copy, Upload, Youtube, AlertTriangle, ChevronLeft, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


const Card = ({ children }) => (
  <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg">
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, className, variant }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`${
      variant === 'secondary' 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-blue-600 hover:bg-blue-700'
    } text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const Tabs = ({ children, activeTab, setActiveTab }) => (
  <div className="space-y-4">
    <div className="flex gap-2 border-b border-gray-800">
      {React.Children.map(children, child => (
        React.cloneElement(child, { activeTab, setActiveTab })
      ))}
    </div>
    {React.Children.map(children, child => (
      child.props.value === activeTab ? child.props.children : null
    ))}
  </div>
);

const Tab = ({ value, label, activeTab, setActiveTab }) => (
  <button
    className={`px-4 py-2 ${
      activeTab === value 
        ? 'border-b-2 border-blue-600 text-blue-500' 
        : 'text-gray-400 hover:text-gray-300'
    }`}
    onClick={() => setActiveTab(value)}
  >
    {label}
  </button>
);

const Alert = ({ children }) => (
  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-2 text-yellow-200">
    <AlertTriangle className="w-5 h-5 text-yellow-500" />
    <div>{children}</div>
  </div>
);

const YouTubeOptimizer = () => {
  const { token, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('input');
  const [transcript, setTranscript] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [blogAnalysis, setBlogAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');

  const analyzeContent = async (analysisType) => {
    if (!transcript.trim()) {
      // Add some user feedback here
      alert('Please enter a transcript first');
      return;
    }
  
    setIsAnalyzing(true);
    setCurrentOperation(analysisType === 'seo' ? 'Generating SEO metadata...' : 'Generating blog post...');
  
    try {
      const data = await api.analyze(transcript, analysisType, token);
      
      if (analysisType === 'seo') {
        setSeoAnalysis(data.analysis);
        setActiveTab('results');
      } else {
        setBlogAnalysis(data.analysis);
        setActiveTab('blog');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setCurrentOperation('');
    }
  };

  const formatSeoMetadata = () => {
    if (!seoAnalysis) return '';
    
    return `
TITLE (${seoAnalysis.title.length} chars):
${seoAnalysis.title}

DESCRIPTION:
${seoAnalysis.description.hook}

${seoAnalysis.description.fullDescription}

CHAPTERS:
${seoAnalysis.description.chapters.map(c => `${c.timestamp} ${c.title}`).join('\n')}

TAGS:
${seoAnalysis.tags.join(', ')}

THUMBNAIL KEYWORDS:
${seoAnalysis.thumbnailKeywords.join(', ')}
    `.trim();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <Button 
              onClick={signOut}  // Use signOut directly
              variant="secondary"
              className="px-3 py-1.5 text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Card>
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-semibold text-white">YouTube Video Optimizer</h1>
            </div>
          </div>

          <div className="p-6">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
              <Tab value="input" label="Input">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Video Upload</label>
                    <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center bg-gray-900/50 hover:bg-gray-900 transition-colors cursor-pointer">
                      <Upload className="mx-auto w-12 h-12 mb-2 text-gray-600" />
                      <p className="text-gray-400">Drop your video here or click to upload</p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Transcript</label>
                    <textarea 
                      value={transcript}
                      onChange={(e) => {
                        setTranscript(e.target.value);
                        console.log('Transcript updated:', e.target.value); // Debug log
                      }}
                      placeholder="Paste your transcript here or upload a file"
                      className="w-full h-32 p-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => analyzeContent('seo')}
                      disabled={!transcript || isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing && currentOperation === 'Generating SEO metadata...' ? (
                        currentOperation
                      ) : (
                        <>
                          <Youtube className="w-4 h-4" />
                          Generate SEO Metadata
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => analyzeContent('blog')}
                      disabled={!transcript || isAnalyzing}
                      className="flex-1"
                      variant="secondary"
                    >
                      {isAnalyzing && currentOperation === 'Generating blog post...' ? (
                        currentOperation
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Generate Blog Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tab>

              <Tab value="results" label="SEO Results">
                {!seoAnalysis ? (
                  <Alert>Generate SEO metadata to see results here.</Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg">
                      <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Generated SEO Metadata</span>
                        <Button 
                          onClick={() => copyToClipboard(formatSeoMetadata())}
                          className="text-sm py-1.5"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                      <textarea
                        value={formatSeoMetadata()}
                        readOnly
                        className="w-full h-96 p-3 bg-gray-900 font-mono text-sm text-gray-300 border-0 focus:ring-0"
                      />
                    </div>
                  </div>
                )}
              </Tab>

              <Tab value="blog" label="Blog Post">
                {!blogAnalysis ? (
                  <Alert>Generate a blog post to see results here.</Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg">
                      <div className="border-b border-gray-800 p-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Generated Blog Post</span>
                        <Button 
                          onClick={() => copyToClipboard(JSON.stringify(blogAnalysis, null, 2))}
                          className="text-sm py-1.5"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-4 space-y-6">
                        <div>
                          <h1 className="text-2xl font-bold text-white mb-2">
                            {blogAnalysis.metadata.title}
                          </h1>
                          <p className="text-gray-400">{blogAnalysis.metadata.metaDescription}</p>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <div className="mb-8">
                            {blogAnalysis.content.introduction}
                          </div>
                          {blogAnalysis.content.sections.map((section, index) => (
                            <div key={index} className="mb-8">
                              <h2 className="text-xl font-bold mb-4">{section.heading}</h2>
                              <div className="mb-4">{section.content}</div>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Key Takeaways:</h3>
                                <ul className="list-disc pl-4 space-y-1">
                                  {section.keyTakeaways.map((takeaway, idx) => (
                                    <li key={idx}>{takeaway}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                          <div className="mb-8">
                            {blogAnalysis.content.conclusion}
                          </div>
                          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                            {blogAnalysis.content.callToAction}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="text-white font-semibold">YouTube Video Optimizer</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm">Built with ❤️ for content creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YouTubeOptimizer;