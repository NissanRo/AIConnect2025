import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutSection() {
  return (
    <section className="max-w-4xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            FinStreet Accelerator is a fast-growing digital-first company incubating multiple ventures in the EdTech and Services space. Three of our prominent brands include:
          </p>
          <ul className="list-disc list-inside space-y-4 text-foreground/90">
            <li><strong className="text-blue-400">Prepedemy</strong> – A soon-to-be-launched test preparation platform catering to IELTS, GMAT, GRE, and TOEFL aspirants.</li>
            <li><strong className="text-pink-400">Saloneur</strong> – A mobile-first service marketplace for salon and spa experiences, currently under active development.</li>
            <li><strong className="text-green-400">FinStreet Education</strong> – A leading coaching provider for professional finance certifications like US CMA and CFA.</li>
          </ul>
          <p className="mt-6 text-muted-foreground">
            We are currently inviting applications from motivated and tech-savvy students for one-year live project internships. Selected candidates will work on cutting-edge use cases in AI and automation, contributing directly to the digital foundation of these startups.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
