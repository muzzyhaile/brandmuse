import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';

const Export = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Export to Google Sheets
          </h1>
          <p className="text-muted-foreground">
            Seamlessly export your content plan to Google Sheets for easy integration
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Content Plan
              </CardTitle>
              <CardDescription>
                Export your entire monthly content calendar with all details, status, and platform information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Monthly Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Content Templates
              </CardTitle>
              <CardDescription>
                Export your saved templates and swipe file content for easy sharing and backup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Templates
              </Button>
            </CardContent>
          </Card>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Export Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click the export button above to generate your Google Sheets file</li>
              <li>The file will include all content with platform, status, and alignment scores</li>
              <li>Import the file into your preferred scheduling tool</li>
              <li>Use the exported data to maintain consistency across platforms</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;