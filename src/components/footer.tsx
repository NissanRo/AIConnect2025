import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center my-16">
      <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
        <Rocket className="h-8 w-8 text-primary" />
        Ready to Build the Future with AI?
      </h2>
      <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
        Submit your interest via our official project onboarding form or contact your faculty coordinator for project allocation details.
      </p>
      <p className="text-sm text-foreground/50">
        For queries, reach out to us at: <a href="mailto:connect@finstreetaccelerator.com" className="text-primary/80 hover:underline">connect@finstreetaccelerator.com</a>
      </p>
    </footer>
  );
}
