'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InterestForm = () => {
  const inputStyles = "w-full p-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground";
  const labelStyles = "block mb-1 text-sm font-medium text-foreground";
  const buttonStyles = "w-full bg-accent text-accent-foreground hover:bg-accent/90 py-2 px-4 rounded-md";

  return (
    <section id="interestFormSection" className="max-w-4xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Express Your Interest</CardTitle>
        </CardHeader>
        <CardContent>
           <form
              action="https://formspree.io/f/mwpqorgp"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label className={labelStyles}>Full Name</label>
                <input type="text" name="full_name" placeholder="Your full name" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Current Location</label>
                <input type="text" name="location" placeholder="City, Country" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Education Specialization</label>
                <input type="text" name="specialization" placeholder="e.g., Computer Science" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Graduation Year</label>
                <input type="number" name="grad_year" placeholder="e.g., 2026" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>College / Institute Name</label>
                <input type="text" name="college" placeholder="Your college or institute" required className={inputStyles} />
              </div>
              
              <div>
                <label className={labelStyles}>Skills</label>
                <input type="text" name="skills" placeholder="e.g., Python, React, ML" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Contact Number</label>
                <input type="text" name="phone" placeholder="Your phone number" className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>Email ID</label>
                <input type="email" name="email" placeholder="Your email address" required className={inputStyles} />
              </div>

              <div>
                <label className={labelStyles}>How will you be working?</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="work_mode" value="Team" required />
                        <span>Team</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="work_mode" value="Individual" />
                        <span>Individual</span>
                    </label>
                </div>
              </div>

              <div>
                  <label className={labelStyles}>Projects of Interest</label>
                  <select name="projects[]" multiple size={6} required className={`${inputStyles} h-auto`}>
                    <option>PROJ-001: AI-Powered Lead Generation</option>
                    <option>PROJ-002: AI-Based Course Recommender</option>
                    <option>PROJ-003: Self-Assessment Tool</option>
                    <option>PROJ-004: Automation Dashboard</option>
                    <option>PROJ-005: AI Content Engine</option>
                    <option>PROJ-006: Social Media Trend Spotter</option>
                    <option>PROJ-007: Feedback Analyzer</option>
                    <option>PROJ-008: WhatsApp Notification Engine</option>
                    <option>PROJ-009: Internship Tracker</option>
                    <option>PROJ-010: Telegram Daily News Digest</option>
                  </select>
              </div>

              <button type="submit" className={buttonStyles}>Submit Interest</button>
            </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default InterestForm;
