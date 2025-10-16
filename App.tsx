/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, {useCallback, useEffect, useState} from 'react';
import {GeneratedContent} from './components/GeneratedContent';
import {Icon} from './components/Icon';
import {ParametersPanel} from './components/ParametersPanel';
import {Window} from './components/Window';
import {APP_DEFINITIONS_CONFIG, INITIAL_MAX_HISTORY_LENGTH} from './constants';
import {streamAppContent} from './services/geminiService';
import {AppDefinition, InteractionData} from './types';

// --- Static content helpers for the About app (my_computer) ---
const getAboutInitialHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <div class="icon" data-interaction-id="open_about_pdf" data-interaction-type="file_open">
          <div class="icon-image">📄</div>
          <div class="icon-label">Profile.pdf</div>
        </div>
      </div>
    </div>
  `;
};

const getAboutPdfHTML = (): string => {
  const paragraph = `Lasitha Wijenayake, Software Developer In Test. With a Bachelor of Computer Science from University College Dublin, my journey has led to Trackman, where as a Software Developer in Test, I craft advanced automation solutions to elevate software quality. At the core of my expertise is a robust command of Cypress, which empowers me to build and maintain effective test strategies.

Collaboration with product and development teams is pivotal in my role, enabling us to refine long-term testing solutions. My drive is fueled by the pursuit of excellence in software quality, leveraging my certifications and knowledge in RPA and solution architecture to create scalable testing frameworks that are integral to Trackman's success.`;
  const [first, second] = paragraph.split("\n\n");
  return `
    <div class="llm-container">
      <div class="llm-row">
        <button class="llm-button" data-interaction-id="go_back_about_home">⬅ Back</button>
      </div>
      <div class="llm-row" style="align-items: center; gap: 12px;">
        <img src="profile/profile-pic.png" alt="Profile photo of Lasitha" class="m-2 w-24 h-24 rounded-full object-cover ring-2 ring-blue-500 shadow" />
        <div>
          <p class="llm-title" style="margin-bottom: 4px;">About Lasitha</p>
          <p class="llm-text" style="margin-top: 0; color: #475569;">Software Developer In Test</p>
        </div>
      </div>
      <p class="llm-text">${first}</p>
      <p class="llm-text">${second}</p>
    </div>
  `;
};

// --- Static content helpers for the Projects app (documents) ---
const getProjectsInitialHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <div class="icon" data-interaction-id="open_projects_github" data-interaction-type="folder_open">
          <div class="icon-image">
            <img src="profile/github.png" alt="GitHub" class="block mx-auto w-12 h-12 mb-2 object-contain rounded-md shadow" />
          </div>
          <div class="icon-label">GitHub Repos</div>
        </div>
        <div class="icon" data-interaction-id="open_projects_npm" data-interaction-type="folder_open">
          <div class="icon-image">
            <img src="profile/npm.png" alt="NPM" class="block mx-auto w-12 h-12 mb-2 object-contain rounded-md shadow" />
          </div>
          <div class="icon-label">NPM Plugins</div>
        </div>
      </div>
    </div>
  `;
};

const getProjectsGithubHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <button class="llm-button" data-interaction-id="go_back_projects_home">⬅ Back</button>
      </div>
      <p class="llm-title">Selected GitHub Repositories</p>
      <div class="llm-container">
        <p class="llm-title" style="font-size: 1rem; margin-top: 8px;">Cypress Testing Utilities</p>
        <p class="llm-text" style="margin-top: 0.25rem;"><a href="https://github.com/lasithdilshan20/cypress-intercept-search" target="_blank" rel="noopener noreferrer">cypress-intercept-search</a> — Network stubbing helper and search utilities.</p>
        <p class="llm-text"><a href="https://github.com/lasithdilshan20/cypress-test-api" target="_blank" rel="noopener noreferrer">cypress-test-api</a> — Quick API test scaffolding with Cypress.</p>

        <p class="llm-title" style="font-size: 1rem; margin-top: 14px;">Reporting</p>
        <p class="llm-text"><a href="https://github.com/lasithdilshan20/cypress-aurora-report" target="_blank" rel="noopener noreferrer">cypress-aurora-report</a> — Rich HTML reporting for Cypress runs.</p>

        <p class="llm-title" style="font-size: 1rem; margin-top: 14px;">Tooling / CLI</p>
        <p class="llm-text"><a href="https://github.com/lasithdilshan20/clicy" target="_blank" rel="noopener noreferrer">clicy</a> — Lightweight CLI utilities.</p>
      </div>
    </div>
  `;
};

const getProjectsNpmHTML = (): string => {
  return `
    <div class=\"llm-container\">
      <div class=\"llm-row\">
        <button class=\"llm-button\" data-interaction-id=\"go_back_projects_home\">⬅ Back</button>
      </div>
      <p class=\"llm-title\">NPM Plugins</p>
      <div class=\"llm-container\">
        <p class=\"llm-title\" style=\"font-size: 1rem; margin-top: 8px;\">Cypress Plugins</p>
        <div class=\"llm-row\" style=\"justify-content: space-between; align-items: center;\">
          <div>
            <p class=\"llm-text\" style=\"margin-bottom: 0;\">
              <a href=\"https://www.npmjs.com/package/cypress-intercept-search\" target=\"_blank\" rel=\"noopener noreferrer\">cypress-intercept-search</a>
            </p>
            <p class=\"llm-text\" style=\"margin-top: 0; color: #475569;\">Downloads — last year: <span id=\"npm_year_cypress_intercept_search\">…</span> · all time: <span id=\"npm_all_cypress_intercept_search\">…</span></p>
          </div>
        </div>
        <div class=\"llm-row\" style=\"justify-content: space-between; align-items: center;\">
          <div>
            <p class=\"llm-text\" style=\"margin-bottom: 0;\">
              <a href=\"https://www.npmjs.com/package/cypress-plugin-store\" target=\"_blank\" rel=\"noopener noreferrer\">cypress-plugin-store</a>
            </p>
            <p class=\"llm-text\" style=\"margin-top: 0; color: #475569;\">Downloads — last year: <span id=\"npm_year_cypress_plugin_store\">…</span> · all time: <span id=\"npm_all_cypress_plugin_store\">…</span></p>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const pkgs = [
            { name: 'cypress-intercept-search', yearId: 'npm_year_cypress_intercept_search', allId: 'npm_all_cypress_intercept_search' },
            { name: 'cypress-plugin-store', yearId: 'npm_year_cypress_plugin_store', allId: 'npm_all_cypress_plugin_store' }
          ];
          function formatNumber(n) {
            try { return n.toLocaleString(); } catch(e) { return String(n); }
          }
          function todayStr() {
            const d = new Date();
            const pad = (x) => String(x).padStart(2, '0');
            return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
          }
          async function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
          pkgs.forEach(async ({name, yearId, allId}) => {
            try {
              // Last year
              const yearRes = await fetch('https://api.npmjs.org/downloads/point/last-year/' + name, { cache: 'no-store' });
              const yearData = yearRes.ok ? await yearRes.json() : null;
              const yearCount = yearData && typeof yearData.downloads === 'number' ? yearData.downloads : null;
              setText(yearId, yearCount != null ? formatNumber(yearCount) : '—');
            } catch (e) { setText(yearId, '—'); }

            try {
              // Approximate all-time using a very wide range up to today (API returns available history)
              const allRes = await fetch('https://api.npmjs.org/downloads/point/1970-01-01:' + todayStr() + '/' + name, { cache: 'no-store' });
              const allData = allRes.ok ? await allRes.json() : null;
              const allCount = allData && typeof allData.downloads === 'number' ? allData.downloads : null;
              setText(allId, allCount != null ? formatNumber(allCount) : '—');
            } catch (e) {
              setText(allId, '—');
            }
          });
        })();
      </script>
    </div>
  `;
};

// --- Static content helpers for the Resume app (notepad_app) ---
const LINKEDIN_URL = 'https://www.linkedin.com/in/lasitha-wijenayake-b8a43bb5/';

const getResumeInitialHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <div class="icon" data-interaction-id="open_resume_web" data-interaction-type="folder_open">
          <div class="icon-image">🌐</div>
          <div class="icon-label">LinkedIn</div>
        </div>
      </div>
    </div>
  `;
};

const getResumeChoiceHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <button class="llm-button" data-interaction-id="go_back_resume_home">⬅ Back</button>
      </div>
    </div>

    <div id="resumeModalOverlay" data-interaction-id="resume_close_popup" style="position: fixed; inset: 0; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; z-index: 50;">
      <div id="resumeModalCard" style="width: min(600px, 92%); background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.25);">
        <div style="background: #dc2626; color: #ffffff; padding: 10px 14px; border-top-left-radius: 12px; border-top-right-radius: 12px; display: flex; align-items: center; gap: 10px; font-weight: 700;">
          <div style="display: flex; gap: 6px;">
            <span style="display:inline-block; width:10px; height:10px; background:#fca5a5; border-radius:50%;"></span>
            <span style="display:inline-block; width:10px; height:10px; background:#fde68a; border-radius:50%;"></span>
            <span style="display:inline-block; width:10px; height:10px; background:#86efac; border-radius:50%;"></span>
          </div>
          <span style="margin-left: 6px;">Important Message</span>
        </div>
        <div style="padding: 16px 18px;">
          <p class="llm-title" style="margin-top: 4px; margin-bottom: 6px;">Open LinkedIn</p>
          <p class="llm-text" style="margin-top: 0;">How would you like to open your LinkedIn profile?</p>
          <div class="llm-row" style="justify-content: center; margin-top: 6px; flex-wrap: wrap;">
            <button class="llm-button" data-interaction-id="resume_choice_external">Open with default browser</button>
            <button class="llm-button" data-interaction-id="resume_choice_embedded">Open in this window</button>
            <button class="llm-button" data-interaction-id="resume_close_popup">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      (function(){
        const overlay = document.getElementById('resumeModalOverlay');
        const card = document.getElementById('resumeModalCard');
        // Removed stopPropagation so button clicks bubble to the container listener
        // This ensures data-interaction-id on the buttons is captured correctly.
        if(overlay){ overlay.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ overlay.click(); } }); overlay.tabIndex = 0; overlay.focus(); }
      })();
    </script>
  `;
};

const getResumeBrowserHTML = (): string => {
  const safeUrl = LINKEDIN_URL;
  return `
    <div class="llm-container">
      <div class="llm-row" style="align-items: center; gap: 8px;">
        <button class="llm-button" data-interaction-id="go_back_resume_home">⬅ Back</button>
        <div style="flex: 1; display: flex; align-items: center; gap: 6px; background: #eef2ff; padding: 6px 8px; border-radius: 8px;">
          <span style="font-size: 18px;">🌐</span>
          <input type="text" class="llm-input" value="${safeUrl}" readonly />
          <button class="llm-button" data-interaction-id="resume_open_external_from_browser">Open in new tab</button>
        </div>
      </div>
      <div class="llm-row" style="height: 60vh;">
        <iframe src="${safeUrl}" style="width: 100%; height: 100%; border: 1px solid #cbd5e1; border-radius: 8px; background: white;" loading="lazy"></iframe>
      </div>
      <p class="llm-text" style="color: #475569;">
        Note: Some websites block being embedded inside other pages. If the page above does not load, please use "Open in new tab" to view it in your browser.
      </p>
    </div>
  `;
};

// --- Static content helpers for the Contact app (trash_bin) ---
const CONTACT_EMAIL = 'lasithdilshan20@gmail.com';
const getContactHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row">
        <div class="icon" data-interaction-id="open_contact_email" data-interaction-type="folder_open">
          <div class="icon-image">✉️</div>
          <div class="icon-label">Email</div>
        </div>
        <div class="icon" data-interaction-id="open_contact_linkedin" data-interaction-type="folder_open">
          <div class="icon-image">🔗</div>
          <div class="icon-label">LinkedIn</div>
        </div>
      </div>
      <p class="llm-text" style="margin-top:4px; color:#334155;">Direct email: <span style="font-weight:600;">${CONTACT_EMAIL}</span></p>
    </div>
  `;
};

// --- Static content helpers for the Links app (web_browser_app) ---
const LINKS = {
  medium: 'https://lasithdilshan20.medium.com/',
  linkedin: 'https://www.linkedin.com/in/lasitha-wijenayake-b8a43bb5/',
  github: 'https://github.com/lasithdilshan20',
  npm: 'https://www.npmjs.com/settings/lasithdilshan20/packages',
  gravatar: 'https://gravatar.com/lasitha20',
  x: 'https://x.com/LasithDilshan20',
};

const getLinksHTML = (): string => {
  return `
    <div class="llm-container">
      <div class="llm-row" style="flex-wrap: wrap;">
        <div class="icon" data-interaction-id="open_link_medium" data-interaction-type="folder_open">
          <div class="icon-image">📝</div>
          <div class="icon-label">Medium Blog</div>
        </div>
        <div class="icon" data-interaction-id="open_link_linkedin" data-interaction-type="folder_open">
          <div class="icon-image">💼</div>
          <div class="icon-label">LinkedIn</div>
        </div>
        <div class="icon" data-interaction-id="open_link_github" data-interaction-type="folder_open">
          <div class="icon-image">
            <img src="profile/github.png" alt="GitHub" class="block mx-auto w-12 h-12 mb-2 object-contain rounded-md shadow" />
          </div>
          <div class="icon-label">GitHub</div>
        </div>
        <div class="icon" data-interaction-id="open_link_npm" data-interaction-type="folder_open">
          <div class="icon-image">
            <img src="profile/npm.png" alt="NPM" class="block mx-auto w-12 h-12 mb-2 object-contain rounded-md shadow" />
          </div>
          <div class="icon-label">npmjs</div>
        </div>
        <div class="icon" data-interaction-id="open_link_gravatar" data-interaction-type="folder_open">
          <div class="icon-image">👤</div>
          <div class="icon-label">Gravatar</div>
        </div>
        <div class="icon" data-interaction-id="open_link_x" data-interaction-type="folder_open">
          <div class="icon-image">✖️</div>
          <div class="icon-label">X</div>
        </div>
      </div>
      <p class="llm-text" style="margin-top:4px; color:#475569;"></p>
    </div>
  `;
};

const DesktopView: React.FC<{onAppOpen: (app: AppDefinition) => void; iconSize: 'sm' | 'md' | 'lg';}> = ({
  onAppOpen,
  iconSize,
}) => (
  <div className="flex flex-wrap content-start p-4">
    {APP_DEFINITIONS_CONFIG.map((app) => (
      <Icon key={app.id} app={app} onInteract={() => onAppOpen(app)} iconSize={iconSize} />
    ))}
  </div>
);

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [previousActiveApp, setPreviousActiveApp] =
    useState<AppDefinition | null>(null);
  const [llmContent, setLlmContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interactionHistory, setInteractionHistory] = useState<
    InteractionData[]
  >([]);
  const [isParametersOpen, setIsParametersOpen] = useState<boolean>(false);
  const [currentMaxHistoryLength, setCurrentMaxHistoryLength] =
    useState<number>(INITIAL_MAX_HISTORY_LENGTH);

  // UI Theme and Icon size settings (Settings panel)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [iconSize, setIconSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Statefulness feature state
  const [isStatefulnessEnabled, setIsStatefulnessEnabled] =
    useState<boolean>(false);
  const [appContentCache, setAppContentCache] = useState<
    Record<string, string>
  >({});
  const [currentAppPath, setCurrentAppPath] = useState<string[]>([]); // For UI graph statefulness

  const internalHandleLlmRequest = useCallback(
    async (historyForLlm: InteractionData[], maxHistoryLength: number) => {
      if (historyForLlm.length === 0) {
        setError('No interaction data to process.');
        return;
      }

      setIsLoading(true);
      setError(null);

      let accumulatedContent = '';
      // Clear llmContent before streaming new content only if not loading from cache
      // This is now handled before this function is called (in handleAppOpen/handleInteraction)
      // setLlmContent(''); // Removed from here, set by caller if needed

      try {
        const stream = streamAppContent(historyForLlm, maxHistoryLength);
        for await (const chunk of stream) {
          accumulatedContent += chunk;
          setLlmContent((prev) => prev + chunk);
        }
      } catch (e: any) {
        setError('Failed to stream content from the API.');
        console.error(e);
        accumulatedContent = `<div class="p-4 text-red-600 bg-red-100 rounded-md">Error loading content.</div>`;
        setLlmContent(accumulatedContent);
      } finally {
        setIsLoading(false);
        // Caching logic is now in useEffect watching llmContent, isLoading, activeApp, currentAppPath etc.
      }
    },
    [],
  );

  // Effect to cache content when loading finishes and statefulness is enabled
  useEffect(() => {
    if (
      !isLoading &&
      currentAppPath.length > 0 &&
      isStatefulnessEnabled &&
      llmContent
    ) {
      const cacheKey = currentAppPath.join('__');
      // Update cache if content is different or not yet cached for this path
      if (appContentCache[cacheKey] !== llmContent) {
        setAppContentCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: llmContent,
        }));
      }
    }
  }, [
    llmContent,
    isLoading,
    currentAppPath,
    isStatefulnessEnabled,
    appContentCache,
  ]);

  const handleInteraction = useCallback(
    async (interactionData: InteractionData) => {
      if (interactionData.id === 'app_close_button') {
        // This specific ID might not be generated by LLM
        handleCloseAppView(); // Use existing close logic
        return;
      }

      // Special-case interactions for the About app to avoid API usage
      if (activeApp?.id === 'my_computer') {
        if (interactionData.id === 'open_about_pdf') {
          setLlmContent(getAboutPdfHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'go_back_about_home') {
          setLlmContent(getAboutInitialHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Special-case interactions for the Projects app to avoid API usage
      if (activeApp?.id === 'documents') {
        if (interactionData.id === 'open_projects_github') {
          setLlmContent(getProjectsGithubHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'open_projects_npm') {
          setLlmContent(getProjectsNpmHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'go_back_projects_home') {
          setLlmContent(getProjectsInitialHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Special-case interactions for the Resume app to avoid API usage
      if (activeApp?.id === 'notepad_app') {
        if (interactionData.id === 'open_resume_web') {
          setLlmContent(getResumeChoiceHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'resume_choice_external' || interactionData.id === 'resume_open_external_from_browser') {
          try { window.open(LINKEDIN_URL, '_blank'); } catch (e) { console.warn('Unable to open external link', e); }
          // After opening externally, return to the initial Resume launcher
          setLlmContent(getResumeInitialHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'resume_choice_embedded') {
          setLlmContent(getResumeBrowserHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'go_back_resume_home' || interactionData.id === 'resume_close_popup') {
          setLlmContent(getResumeInitialHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Special-case interactions for the Contact app to avoid API usage
      if (activeApp?.id === 'trash_bin') {
        if (interactionData.id === 'open_contact_email') {
          try { window.location.href = 'mailto:' + CONTACT_EMAIL; } catch (e) { console.warn('Unable to open mail client', e); }
          setLlmContent(getContactHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
        if (interactionData.id === 'open_contact_linkedin') {
          try { window.open(LINKEDIN_URL, '_blank'); } catch (e) { console.warn('Unable to open external link', e); }
          setLlmContent(getContactHTML());
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Special-case interactions for the Links app to avoid API usage
      if (activeApp?.id === 'web_browser_app') {
        const open = (url: string) => { try { window.open(url, '_blank'); } catch (e) { console.warn('Unable to open external link', e); } };
        if (interactionData.id === 'open_link_medium') { open(LINKS.medium); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
        if (interactionData.id === 'open_link_linkedin') { open(LINKS.linkedin); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
        if (interactionData.id === 'open_link_github') { open(LINKS.github); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
        if (interactionData.id === 'open_link_npm') { open(LINKS.npm); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
        if (interactionData.id === 'open_link_gravatar') { open(LINKS.gravatar); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
        if (interactionData.id === 'open_link_x') { open(LINKS.x); setLlmContent(getLinksHTML()); setIsLoading(false); setError(null); return; }
      }

      const newHistory = [
        interactionData,
        ...interactionHistory.slice(0, currentMaxHistoryLength - 1),
      ];
      setInteractionHistory(newHistory);

      const newPath = activeApp
        ? [...currentAppPath, interactionData.id]
        : [interactionData.id];
      setCurrentAppPath(newPath);
      const cacheKey = newPath.join('__');

      setLlmContent('');
      setError(null);

      if (isStatefulnessEnabled && appContentCache[cacheKey]) {
        setLlmContent(appContentCache[cacheKey]);
        setIsLoading(false);
      } else {
        internalHandleLlmRequest(newHistory, currentMaxHistoryLength);
      }
    },
    [
      interactionHistory,
      internalHandleLlmRequest,
      activeApp,
      currentMaxHistoryLength,
      currentAppPath,
      isStatefulnessEnabled,
      appContentCache,
    ],
  );

  const handleAppOpen = (app: AppDefinition) => {
    // Special-case: About app should not use API. Render static content with a PDF icon.
    if (app.id === 'my_computer') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getAboutInitialHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    // Special-case: Projects app should not use API. Render static Projects launcher.
    if (app.id === 'documents') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getProjectsInitialHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    // Special-case: Resume app should not use API. Render static web launcher.
    if (app.id === 'notepad_app') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getResumeInitialHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    // Special-case: Skills app should not use API. Render static skills view.
    if (app.id === 'settings_app') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getSkillsHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    // Special-case: Contact app should not use API. Render static contact view.
    if (app.id === 'trash_bin') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getContactHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    // Special-case: Links app should not use API. Render static links view.
    if (app.id === 'web_browser_app') {
      if (isParametersOpen) setIsParametersOpen(false);
      setActiveApp(app);
      setLlmContent(getLinksHTML());
      setError(null);
      setIsLoading(false);
      setInteractionHistory([]);
      setCurrentAppPath([app.id]);
      return;
    }

    const initialInteraction: InteractionData = {
      id: app.id,
      type: 'app_open',
      elementText: app.name,
      elementType: 'icon',
      appContext: app.id,
    };

    const newHistory = [initialInteraction];
    setInteractionHistory(newHistory);

    const appPath = [app.id];
    setCurrentAppPath(appPath);
    const cacheKey = appPath.join('__');

    if (isParametersOpen) {
      setIsParametersOpen(false);
    }
    setActiveApp(app);
    setLlmContent('');
    setError(null);

    if (isStatefulnessEnabled && appContentCache[cacheKey]) {
      setLlmContent(appContentCache[cacheKey]);
      setIsLoading(false);
    } else {
      internalHandleLlmRequest(newHistory, currentMaxHistoryLength);
    }
  };

  const handleCloseAppView = () => {
    setActiveApp(null);
    setLlmContent('');
    setError(null);
    setInteractionHistory([]);
    setCurrentAppPath([]);
  };

  const handleToggleParametersPanel = () => {
    setIsParametersOpen((prevIsOpen) => {
      const nowOpeningParameters = !prevIsOpen;
      if (nowOpeningParameters) {
        // Store the currently active app (if any) so it can be restored,
        // or null if no app is active (desktop view).
        setPreviousActiveApp(activeApp);
        setActiveApp(null); // Clear active app to show parameters panel
        setLlmContent('');
        setError(null);
        // Interaction history and current path are not cleared here,
        // as they might be relevant if the user returns to an app.
      } else {
        // Closing parameters panel - always go back to desktop view
        setPreviousActiveApp(null); // Clear any stored previous app
        setActiveApp(null); // Ensure desktop view
        setLlmContent('');
        setError(null);
        setInteractionHistory([]); // Clear history when returning to desktop from parameters
        setCurrentAppPath([]); // Clear app path
      }
      return nowOpeningParameters;
    });
  };

  const handleUpdateHistoryLength = (newLength: number) => {
    setCurrentMaxHistoryLength(newLength);
    // Trim interaction history if new length is shorter
    setInteractionHistory((prev) => prev.slice(0, newLength));
  };

  const handleSetStatefulness = (enabled: boolean) => {
    setIsStatefulnessEnabled(enabled);
    if (!enabled) {
      setAppContentCache({});
    }
  };

  const windowTitle = isParametersOpen
    ? "Lasitha's Computer"
    : activeApp
      ? activeApp.name
      : "Lasitha's Computer";
  const contentBgColor = theme === 'dark' ? '#0f172a' : '#ffffff';

  const handleMasterClose = () => {
    if (isParametersOpen) {
      handleToggleParametersPanel();
    } else if (activeApp) {
      handleCloseAppView();
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'theme-dark' : ''} w-full min-h-screen flex items-center justify-center p-4`}>
      <Window
        title={windowTitle}
        onClose={handleMasterClose}
        isAppOpen={!!activeApp && !isParametersOpen}
        appId={activeApp?.id}
        onToggleParameters={handleToggleParametersPanel}
        onExitToDesktop={handleCloseAppView}
        isParametersPanelOpen={isParametersOpen}>
        <div
          className="w-full h-full"
          style={{backgroundColor: contentBgColor}}>
          {isParametersOpen ? (
            <ParametersPanel
              theme={theme}
              onSetTheme={setTheme}
              iconSize={iconSize}
              onSetIconSize={setIconSize}
              onClosePanel={handleToggleParametersPanel}
            />
          ) : !activeApp ? (
            <DesktopView onAppOpen={handleAppOpen} iconSize={iconSize} />
          ) : (
            <>
              {isLoading && llmContent.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              {error && (
                <div className="p-4 text-red-600 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              {(!isLoading || llmContent) && (
                <GeneratedContent
                  htmlContent={llmContent}
                  onInteract={handleInteraction}
                  appContext={activeApp.id}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </Window>
    </div>
  );
};

export default App;


// --- Static content helpers for the Skills app (settings_app) ---
const getSkillsHTML = (): string => {
  return `
    <div class="llm-container">
      <p class="llm-title">Core Skills</p>
      <div class="llm-row" style="flex-wrap: wrap; align-items: stretch;">
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">🧪</span> <strong>Cypress Automation</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:95%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">End‑to‑end, component, and API tests; custom utilities and plugins.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">💻</span> <strong>JavaScript / TypeScript</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:90%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Libraries, tooling, typings, Node.js ecosystem.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">🔗</span> <strong>API Testing</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:85%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Contract, integration, and workflow validation.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">⚙️</span> <strong>CI/CD (GitHub Actions)</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:80%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Pipeline design for reliable, scalable test runs.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">📦</span> <strong>NPM Publishing & OSS</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:85%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Author of Cypress plugins; versioning and distribution.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">📊</span> <strong>Reporting & Insights</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:80%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Actionable test reports and result analytics.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">🤖</span> <strong>RPA Fundamentals</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:70%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Automation mindset beyond testing workflows.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">🏗️</span> <strong>Solution Architecture</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:70%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Designing scalable test frameworks aligned to product goals.</p>
        </div>
        <div class="p-3 m-2 rounded-lg border border-slate-200 bg-white shadow-sm min-w-[220px] flex-1">
          <p class="llm-text" style="margin-bottom:6px;"><span style="font-size:18px;">🤝</span> <strong>Collaboration & QA Strategy</strong></p>
          <div class="w-full h-2 bg-slate-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width:85%"></div></div>
          <p class="llm-text" style="margin-top:6px; color:#475569;">Partnering with product and engineering for quality at scale.</p>
        </div>
      </div>

      <p class="llm-title" style="margin-top:6px;">Toolbox</p>
      <div class="llm-row" style="flex-wrap: wrap;">
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">Cypress</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">JavaScript</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">TypeScript</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">Node.js</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-red-50 text-red-700 border border-red-200">NPM</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200">REST / JSON</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">GitHub Actions</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">Git</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">Reporting</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">HTML/CSS</span>
        <span class="llm-text px-2 py-1 m-1 rounded-md bg-violet-50 text-violet-700 border border-violet-200">VS Code</span>
      </div>

    </div>
  `;
};
