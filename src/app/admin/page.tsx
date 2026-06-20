'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { 
  Shield, 
  LogOut, 
  Database, 
  AlertTriangle, 
  Users, 
  User, 
  Activity, 
  DollarSign, 
  Settings, 
  Layers, 
  CheckCircle, 
  XCircle, 
  Plus, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  Cpu,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sliders,
  Globe,
  Trash2,
  Compass,
  Save,
  Info,
  Link as LinkIcon,
  Palette,
  Check,
  Upload,
  Image as ImageIcon,
  Zap,
  RefreshCcw,
  GraduationCap,
  Terminal,
  Lock,
  Eye
} from 'lucide-react';

const techIconMap: { [key: string]: React.ComponentType<any> } = {
  Zap,
  RefreshCcw,
  GraduationCap,
  Cpu,
  Shield,
  Activity,
  Globe,
  Terminal,
  Lock,
  Settings
};

const TECH_ICON_OPTIONS = [
  { value: 'Zap', label: 'Zap (Lightning)' },
  { value: 'RefreshCcw', label: 'RefreshCcw (Circular)' },
  { value: 'GraduationCap', label: 'Graduation (Cap)' },
  { value: 'Cpu', label: 'Cpu (Processor)' },
  { value: 'Shield', label: 'Shield (Security)' },
  { value: 'Activity', label: 'Activity (Pulse)' },
  { value: 'Globe', label: 'Globe (Network)' },
  { value: 'Terminal', label: 'Terminal (Developer)' },
  { value: 'Lock', label: 'Lock (Secure)' },
  { value: 'Settings', label: 'Settings (Control)' }
];

const ASSET_FORMAT_OPTIONS = [
  { value: 'High-Res PNG', label: 'High-Res PNG' },
  { value: 'Transparent PNG', label: 'Transparent PNG' },
  { value: 'Isolated PNG', label: 'Isolated PNG' },
  { value: 'Wallpapers PNG', label: 'Wallpapers PNG' },
  { value: 'Vector GIF', label: 'Vector GIF' },
  { value: 'Futuristic JPG', label: 'Futuristic JPG' },
  { value: 'Vector SVG', label: 'Vector SVG' }
];

const ROADMAP_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' }
];

const CRYSTARA_NETWORK_OPTIONS = [
  { value: 'mainnet', label: 'Mainnet (Production)' },
  { value: 'testnet', label: 'Testnet (Development)' }
];

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="custom-select-wrapper" style={style}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-text">{selectedOption ? selectedOption.label : value}</span>
        <ChevronDown size={16} className={`arrow-icon ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="custom-select-options-list">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`custom-select-option-item ${isSelected ? 'selected' : ''}`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="check-icon" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simulated Mock Data for the Dashboard when Supabase is in Mock Mode

const INITIAL_MOCK_WHITELIST = [
  { address: 'sps1a9px...fe3x9w812', name: 'Gloopo Core Dev', addedAt: '2026-05-10', tier: 'Vanguard' },
  { address: 'sps1q5wz...e9w4zk102', name: 'Supra Partner Mod', addedAt: '2026-05-12', tier: 'Partner' },
  { address: 'sps1c7hp...r2h8pd205', name: 'Atmos Grad Alpha Minter', addedAt: '2026-05-15', tier: 'Alpha Tester' }
];

const DEFAULT_BRAND_ASSETS = [
  {
    title: 'Gloopo 3D Mascot Character',
    filename: 'gloo_character.png',
    path: '/images/gloo_character.png',
    size: '737 KB',
    dimensions: '2048 x 2048 px',
    format: 'High-Res PNG',
    desc: 'Official mascot icon for banners, listings, and profile graphics.'
  },
  {
    title: 'Gloopo Wordmark Typography',
    filename: 'gloo-text.png',
    path: '/images/gloo-text.png',
    size: '39.6 KB',
    dimensions: '800 x 300 px',
    format: 'Transparent PNG',
    desc: 'Logotype for banners, website headers, and corporate listings.'
  },
  {
    title: 'Tokenomics Pie Render',
    filename: 'token-char.png',
    path: '/images/token-char.png',
    size: '539 KB',
    dimensions: '1024 x 1024 px',
    format: 'Isolated PNG',
    desc: 'Official 3D illustrated pie chart asset for pitch decks and slides.'
  },
  {
    title: 'Space Exploration Landscape',
    filename: 'brand-kit.png',
    path: '/images/brand-kit.png',
    size: '685 KB',
    dimensions: '1920 x 1080 px',
    format: 'Wallpapers PNG',
    desc: 'Premium futuristic space vector scenery used in section backgrounds.'
  },
  {
    title: 'Gloopo Mascot Animation',
    filename: 'gloopo.gif',
    path: '/images/gloopo.gif',
    size: '15.4 MB',
    dimensions: '600 x 600 px',
    format: 'Vector GIF',
    desc: 'Motion design mascot animation for presentation overlays.'
  },
  {
    title: 'Hero Backdrop Nebula',
    filename: 'hero_bg.png',
    path: '/images/hero_bg.png',
    size: '753 KB',
    dimensions: '1920 x 1080 px',
    format: 'Futuristic JPG',
    desc: 'Dark galactic atmospheric background graphic for landing pages.'
  }
];

const AdminDashboardPage = () => {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'overview' | 'supabase' | 'settings' | 'logs' | 'profile'>('overview');

  // Console Overview Stats
  const [activeAdminsCount, setActiveAdminsCount] = useState(1);
  const [todayPageViews, setTodayPageViews] = useState(0);
  const [todayUniqueVisitors, setTodayUniqueVisitors] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [totalUniqueVisitors, setTotalUniqueVisitors] = useState(0);
  const [trafficHistory, setTrafficHistory] = useState<any[]>([]);
  
  // Logs System States
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showClearLogsModal, setShowClearLogsModal] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const LOGS_PER_PAGE = 25;
  
  // Dashboard & Whitelist States
  const [whitelist, setWhitelist] = useState(INITIAL_MOCK_WHITELIST);
  const [isMintingActive, setIsMintingActive] = useState(true);
  const [isSwapPaused, setIsSwapPaused] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState('0.5%');
  const [contractGasLimit, setContractGasLimit] = useState('1,500,000');
  const [newWhitelistAddress, setNewWhitelistAddress] = useState('');
  const [newWhitelistName, setNewWhitelistName] = useState('');
  const [newWhitelistTier, setNewWhitelistTier] = useState('Alpha Tester');

  // --- CMS WEBSITE SETTINGS STATES ---
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'about' | 'tokenomics' | 'socials' | 'brandkit' | 'roadmap' | 'buttons' | 'nfts' | 'partners' | 'security'>('about');
  const [saveLoading, setSaveLoading] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Navbar Buttons Settings
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [showLoreMenu, setShowLoreMenu] = useState(true);
  const [showTechMenu, setShowTechMenu] = useState(true);
  const [showTokenomicsMenu, setShowTokenomicsMenu] = useState(true);
  const [showSwapMenu, setShowSwapMenu] = useState(true);
  const [showRoadmapMenu, setShowRoadmapMenu] = useState(true);
  const [showShowcaseMenu, setShowShowcaseMenu] = useState(true);
  const [showBrandKitMenu, setShowBrandKitMenu] = useState(true);

  // NFTs Settings
  const [nftsMaintenanceMode, setNftsMaintenanceMode] = useState(true);
  const [nftsCrystaraCreator, setNftsCrystaraCreator] = useState('');
  const [nftsCrystaraCollection, setNftsCrystaraCollection] = useState('');
  const [nftsCrystaraApiKey, setNftsCrystaraApiKey] = useState('');
  const [nftsCrystaraNetwork, setNftsCrystaraNetwork] = useState<'mainnet' | 'testnet'>('mainnet');

  // NFT Collections and Maintenance Toggles
  const [nftsOgpassCollection, setNftsOgpassCollection] = useState('');
  const [nftsOgpassMaintenance, setNftsOgpassMaintenance] = useState(true);
  const [nftsOgpassCreator, setNftsOgpassCreator] = useState('');
  const [nftsGen01Collection, setNftsGen01Collection] = useState('');
  const [nftsGen01Maintenance, setNftsGen01Maintenance] = useState(false);
  const [nftsGen01Creator, setNftsGen01Creator] = useState('');
  const [nftsGen02Collection, setNftsGen02Collection] = useState('');
  const [nftsGen02Maintenance, setNftsGen02Maintenance] = useState(true);
  const [nftsGen02Creator, setNftsGen02Creator] = useState('');
  const [nftsGen03Collection, setNftsGen03Collection] = useState('');
  const [nftsGen03Maintenance, setNftsGen03Maintenance] = useState(true);
  const [nftsGen03Creator, setNftsGen03Creator] = useState('');

  // General Settings
  const [genSiteName, setGenSiteName] = useState('Gloopo');
  const [genSiteTitle, setGenSiteTitle] = useState('Gloopo - Community-Driven Assets on Supra L1');
  const [genMetaDesc, setGenMetaDesc] = useState('Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.');
  const [genMaintenanceMode, setGenMaintenanceMode] = useState(false);
  const [genWhitepaperV1, setGenWhitepaperV1] = useState('https://docs.gloopo.xyz/whitepaper-v1');
  const [genWhitepaperV2, setGenWhitepaperV2] = useState('https://docs.gloopo.xyz/whitepaper-v2');

  // About Settings
  const [aboutHeadline, setAboutHeadline] = useState('Who is Gloopo?');
  const [aboutSubheadline, setAboutSubheadline] = useState('Origin Story');
  const [aboutDescription, setAboutDescription] = useState('Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration. More than just an asset, Gloopo is a narrative journey that transforms holders into explorers of the Supra ecosystem.');

  // Tech Cards Settings
  const [techCard1Icon, setTechCard1Icon] = useState('Zap');
  const [techCard1Title, setTechCard1Title] = useState('High Throughput');
  const [techCard1Desc, setTechCard1Desc] = useState('Low-latency consensus for a seamless experience.');

  const [techCard2Icon, setTechCard2Icon] = useState('RefreshCcw');
  const [techCard2Title, setTechCard2Title] = useState('Bridgeless');
  const [techCard2Desc, setTechCard2Desc] = useState('Strategic alignment with Supra\'s interoperability stack.');

  const [techCard3Icon, setTechCard3Icon] = useState('GraduationCap');
  const [techCard3Title, setTechCard3Title] = useState('Maturity');
  const [techCard3Desc, setTechCard3Desc] = useState('Proven graduation from the Atmos Protocol process.');

  // Tokenomics Settings
  const [tokenTicker, setTokenTicker] = useState('GLOOPO');
  const [tokenTotalSupply, setTokenTotalSupply] = useState('1,000,000,000');
  const [tokenLiquidityFee, setTokenLiquidityFee] = useState('2.0%');
  const [tokenMarketingFee, setTokenMarketingFee] = useState('1.0%');
  const [tokenChartData, setTokenChartData] = useState([
    { label: 'Public Pool', percentage: 20, color: '#00FF88' },
    { label: 'LLIM Treasury', percentage: 20, color: '#10F090' },
    { label: 'Ecosystem', percentage: 20, color: '#20E198' },
    { label: 'Core Team', percentage: 10, color: '#30D2A0' },
    { label: 'Airdrop', percentage: 10, color: '#40C3A8' },
    { label: 'NFT Holders', percentage: 10, color: '#50B4B0' },
    { label: 'Treasury', percentage: 5, color: '#60A5B8' },
    { label: 'Strategic', percentage: 5, color: '#7096C0' }
  ]);

  // Social Links
  const [socialTwitter, setSocialTwitter] = useState('https://x.com/gloopo');
  const [socialTelegram, setSocialTelegram] = useState('https://t.me/gloopo');
  const [socialDiscord, setSocialDiscord] = useState('https://discord.gg/gloopo');

  // Brand Kit Settings
  const [brandPrimary, setBrandPrimary] = useState('#00ff88');
  const [brandAccent, setBrandAccent] = useState('#bbff00');
  const [brandBackground, setBrandBackground] = useState('#030806');
  const [brandLogoPng, setBrandLogoPng] = useState('/images/logo.png');
  const [brandLogoSvg, setBrandLogoSvg] = useState('M12 2L2 22h20L12 2z');
  // Dynamic Brand Assets List CMS
  const [brandAssetsList, setBrandAssetsList] = useState<any[]>(DEFAULT_BRAND_ASSETS);
  // Brand Asset Creation Temp States
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetDesc, setNewAssetDesc] = useState('');
  const [newAssetFormat, setNewAssetFormat] = useState('High-Res PNG');
  const [newAssetDimensions, setNewAssetDimensions] = useState('2048 x 2048 px');
  const [newAssetSize, setNewAssetSize] = useState('');
  const [newAssetPath, setNewAssetPath] = useState('');
  const [newAssetFilename, setNewAssetFilename] = useState('');
  const [newAssetStorageFilename, setNewAssetStorageFilename] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Partners Settings
  const [partnersList, setPartnersList] = useState<any[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Logout Confirmation Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Roadmap Settings (Array List of Objects)
  const [roadmapPhases, setRoadmapPhases] = useState([
    { phase: 'Phase 0', title: 'Preparation', status: 'completed', items: ['Token Studio creation', '75% pre-buy execution', 'Crystara NFT collection'] },
    { phase: 'Phase 1', title: 'Activation', status: 'completed', items: ['G/$S pool deployment', 'LLIM Activation', 'Liquidity top-ups'] },
    { phase: 'Phase 2', title: 'Dominance', status: 'active', items: ['Gen 1 NFT Launch', 'Social dominance campaign', 'Community expansion'] },
    { phase: 'Phase 3', title: 'Governance', status: 'pending', items: ['Lore expansion', 'Website integration', 'Gloopo DAO Launch'] },
    { phase: 'Phase 4', title: 'Expansion', status: 'pending', items: ['Final LLIM Deployment', 'Cross-chain reach', 'Supra Bridging'] }
  ]);

  // Roadmap Creation Temp States
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseStatus, setNewPhaseStatus] = useState<'completed' | 'active' | 'pending'>('pending');
  const [newPhaseItemText, setNewPhaseItemText] = useState('');
  const [currentPhaseItems, setCurrentPhaseItems] = useState<string[]>([]);

  // Tokenomics Slice Creation Temp States
  const [newSliceLabel, setNewSliceLabel] = useState('');
  const [newSlicePct, setNewSlicePct] = useState(0);
  const [newSliceColor, setNewSliceColor] = useState('#00ff88');

  // MFA Security System States
  const [loadingMfa, setLoadingMfa] = useState(false);
  const [mfaActive, setMfaActive] = useState(false);
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [mfaStep, setMfaStep] = useState<'none' | 'enroll' | 'disable'>('none');
  const [mfaFactorId, setMfaFactorId] = useState('');

  // Check MFA Status function
  const checkMfaStatus = async () => {
    if (isSupabaseConfigured && supabase) {
      setLoadingMfa(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No active user session');

        // Fetch DB status
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('mfa_enabled')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;

        // Fetch Supabase Auth status
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        
        const activeTotp = factorsData?.all?.find(f => f.status === 'verified' && f.factor_type === 'totp');
        
        // MFA is active only if it is verified in Supabase Auth AND enabled in database profile
        if (activeTotp && profile?.mfa_enabled) {
          setMfaActive(true);
          setMfaFactorId(activeTotp.id);
        } else {
          setMfaActive(false);
          setMfaFactorId(activeTotp ? activeTotp.id : '');
        }
      } catch (err) {
        console.error('Failed to check MFA status:', err);
      } finally {
        setLoadingMfa(false);
      }
    }
  };

  // Check status when the profile settings tab is loaded
  useEffect(() => {
    if (currentTab === 'profile') {
      checkMfaStatus();
    }
  }, [currentTab]);

  // MFA Handlers
  const handleEnableMfa = async () => {
    if (isSupabaseConfigured && supabase) {
      setMfaStep('enroll');
      setMfaVerifyCode('');
      try {
        // List existing factors first
        const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
        if (listError) throw listError;
        
        // Unenroll only unverified factors since unenrolling verified factors requires aal2 session
        const unverifiedFactors = factorsData?.all?.filter(f => f.status === 'unverified') || [];
        for (const factor of unverifiedFactors) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }

        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Gloopo L1',
          friendlyName: adminEmail
        });
        if (error) throw error;
        
        setMfaFactorId(data.id);
        setMfaSecret(data.totp.secret || '');
        setMfaQrCode(data.totp.qr_code || '');
      } catch (err: any) {
        showToast(`Failed to enroll MFA: ${err.message}`, 'error');
        setMfaStep('none');
      }
    }
  };

  const handleVerifyMfa = async () => {
    if (isSupabaseConfigured && supabase && mfaFactorId) {
      try {
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: mfaFactorId
        });
        if (challengeError) throw challengeError;
        
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: mfaFactorId,
          challengeId: challengeData.id,
          code: mfaVerifyCode
        });
        if (verifyError) throw verifyError;

        // Update database profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: dbError } = await supabase
            .from('admin_profiles')
            .update({ mfa_enabled: true })
            .eq('id', user.id);
          if (dbError) throw dbError;
        }
        
        showToast('Google Authenticator MFA successfully enabled!', 'success');
        setMfaStep('none');
        await logAdminAction('enable_mfa', `Enabled MFA Google Authenticator security`);
        await checkMfaStatus();
      } catch (err: any) {
        showToast(`Verification failed: ${err.message}`, 'error');
      }
    }
  };

  const handleDisableMfa = () => {
    setMfaStep('disable');
    setMfaVerifyCode('');
  };

  const handleVerifyDisableMfa = async () => {
    if (isSupabaseConfigured && supabase && mfaFactorId) {
      if (!mfaVerifyCode) {
        showToast('Please enter the verification code.', 'error');
        return;
      }
      try {
        // Step 1: Challenge the factor
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: mfaFactorId
        });
        if (challengeError) throw challengeError;
        
        // Step 2: Verify the challenge
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: mfaFactorId,
          challengeId: challengeData.id,
          code: mfaVerifyCode
        });
        if (verifyError) throw verifyError;
        
        // Step 3: Unenroll (Disable) the factor since verification was successful
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: mfaFactorId
        });
        if (unenrollError) throw unenrollError;

        // Step 4: Update database profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: dbError } = await supabase
            .from('admin_profiles')
            .update({ mfa_enabled: false })
            .eq('id', user.id);
          if (dbError) throw dbError;
        }
        
        showToast('MFA has been successfully disabled.', 'warning');
        setMfaStep('none');
        setMfaVerifyCode('');
        await logAdminAction('disable_mfa', `Disabled MFA Google Authenticator security`);
        await checkMfaStatus();
      } catch (err: any) {
        showToast(`Verification failed: ${err.message}`, 'error');
      }
    }
  };

  // Logs Action Helper
  const logAdminAction = async (action: string, details: string) => {
    const timestamp = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('admin_logs')
          .insert({
            admin_email: adminEmail,
            action,
            details
          });
        if (error) console.error('Failed to log admin action to Supabase:', error);
      } catch (err) {
        console.error('Failed to log admin action:', err);
      }
    } else {
      // Mock mode
      const stored = localStorage.getItem('gloopo_mock_logs');
      const currentLogs = stored ? JSON.parse(stored) : [];
      const newLog = {
        id: Date.now(),
        admin_email: adminEmail || 'mock-admin@gloopo.com',
        action,
        details,
        created_at: timestamp
      };
      const updatedLogs = [newLog, ...currentLogs];
      localStorage.setItem('gloopo_mock_logs', JSON.stringify(updatedLogs));
      if (currentTab === 'logs') {
        setLogs(updatedLogs);
      }
    }
  };

  // Fetch Logs Helper
  const fetchLogs = async () => {
    if (isSupabaseConfigured && supabase) {
      setLoadingLogs(true);
      try {
        const { data, error } = await supabase
          .from('admin_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setLogs(data || []);
      } catch (err: any) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    } else {
      const stored = localStorage.getItem('gloopo_mock_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        setLogs([]);
      }
    }
  };

  // Clear Logs Helper
  const handleClearLogs = () => {
    setShowClearLogsModal(true);
  };

  const executeClearLogs = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('admin_logs')
          .delete()
          .neq('id', 0);
        if (error) throw error;
        showToast('All logs cleared successfully!', 'success');
        setLogs([]);
      } catch (err: any) {
        showToast(`Failed to clear logs: ${err.message}`, 'error');
      }
    } else {
      localStorage.removeItem('gloopo_mock_logs');
      setLogs([]);
      showToast('All logs cleared successfully (mock mode)!', 'success');
    }
  };

  // Delete Single Log Helper
  const handleDeleteSingleLog = async (logId: number) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('admin_logs')
          .delete()
          .eq('id', logId);
        if (error) throw error;
        showToast('Log entry deleted.', 'success');
      } catch (err: any) {
        showToast(`Failed to delete log: ${err.message}`, 'error');
      }
    } else {
      const stored = localStorage.getItem('gloopo_mock_logs');
      if (stored) {
        const currentLogs = JSON.parse(stored);
        const updated = currentLogs.filter((l: any) => l.id !== logId);
        localStorage.setItem('gloopo_mock_logs', JSON.stringify(updated));
        setLogs(updated);
        showToast('Log entry deleted.', 'success');
      }
    }
  };

  // Realtime logs sync hook
  useEffect(() => {
    if (currentTab === 'logs') {
      fetchLogs();
      if (isSupabaseConfigured && supabase) {
        const channel = supabase
          .channel('admin-logs-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'admin_logs' },
            () => {
              fetchLogs();
            }
          )
          .subscribe();
        return () => {
          supabase?.removeChannel(channel);
        };
      }
    }
  }, [currentTab]);

  // Authentication guard and initial data loading
  useEffect(() => {
    const authenticateAndLoad = async () => {
      setLoading(true);

      // Restore last opened tab & settings sub-tab from localStorage
      const savedTab = localStorage.getItem('admin_current_tab');
      if (savedTab && ['overview', 'supabase', 'settings', 'logs', 'profile'].includes(savedTab)) {
        setCurrentTab(savedTab as any);
      }
      const savedSubTab = localStorage.getItem('admin_settings_sub_tab');
      if (savedSubTab && ['general', 'about', 'tokenomics', 'socials', 'brandkit', 'roadmap', 'buttons', 'nfts', 'partners', 'security'].includes(savedSubTab)) {
        setSettingsSubTab(savedSubTab as any);
      }
      
      // Auth Check
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Retrieve admin profile to verify privileges
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('role, status')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin' || profile.status !== 'active') {
          console.warn('Unauthorized access attempt by authenticated user:', session.user.email);
          await supabase.auth.signOut();
          router.push('/admin/login?error=unauthorized');
          return;
        }

        setAdminEmail(session.user.email || 'Supabase Admin');
      } else {
        const mockAuth = localStorage.getItem('gloopo_mock_admin_auth');
        if (mockAuth !== 'true') {
          router.push('/admin/login');
          return;
        } else {
          setAdminEmail(localStorage.getItem('gloopo_mock_admin_email') || 'mock-admin@gloopo.com');
        }
      }

      // Load Settings and Stats from Supabase or LocalStorage
      await fetchWebsiteSettings();
      await fetchDashboardStats();
      setLoading(false);
    };
    authenticateAndLoad();
  }, [router]);

  // Persist tab choices to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('admin_current_tab', currentTab);
    }
  }, [currentTab, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('admin_settings_sub_tab', settingsSubTab);
    }
  }, [settingsSubTab, loading]);

  const fetchDashboardStats = async () => {
    const todayStr = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Fetch active admins count
        const { count: adminCount, error: adminErr } = await supabase
          .from('admin_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')
          .eq('status', 'active');
        if (!adminErr && adminCount !== null) {
          setActiveAdminsCount(adminCount);
        }

        // 2. Fetch traffic history (last 7 entries)
        const { data: trafficData, error: trafficErr } = await supabase
          .from('traffic_stats')
          .select('*')
          .order('date', { ascending: false })
          .limit(7);
        
        if (!trafficErr && trafficData) {
          // Reverse to date ascending order for charting
          const sortedTraffic = [...trafficData].reverse();
          setTrafficHistory(sortedTraffic);

          // Calculate totals and today's stats
          let totalViews = 0;
          let totalVisitors = 0;
          let todayViews = 0;
          let todayVisitors = 0;

          // Fetch overall totals from DB
          const { data: allTraffic } = await supabase.from('traffic_stats').select('page_views, unique_visitors');
          if (allTraffic) {
            allTraffic.forEach(entry => {
              totalViews += entry.page_views || 0;
              totalVisitors += entry.unique_visitors || 0;
            });
          }

          // Today's entry
          const todayEntry = trafficData.find(s => s.date === todayStr);
          if (todayEntry) {
            todayViews = todayEntry.page_views || 0;
            todayVisitors = todayEntry.unique_visitors || 0;
          }

          setTodayPageViews(todayViews);
          setTodayUniqueVisitors(todayVisitors);
          setTotalPageViews(totalViews);
          setTotalUniqueVisitors(totalVisitors);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats from Supabase:', err);
      }
    } else {
      // Mock Mode Loader
      try {
        const stored = localStorage.getItem('gloopo_mock_traffic_stats');
        let stats: any[] = stored ? JSON.parse(stored) : [];

        // If no stats, generate simulated 7 days of stats
        if (stats.length === 0) {
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            stats.push({
              date: dStr,
              page_views: Math.floor(Math.random() * 80) + 100,
              unique_visitors: Math.floor(Math.random() * 30) + 40
            });
          }
          localStorage.setItem('gloopo_mock_traffic_stats', JSON.stringify(stats));
        }

        // Set state from mock data
        setTrafficHistory(stats);
        setActiveAdminsCount(4); // Mock admin count

        let totalViews = 0;
        let totalVisitors = 0;
        let todayViews = 0;
        let todayVisitors = 0;

        stats.forEach(entry => {
          totalViews += entry.page_views || 0;
          totalVisitors += entry.unique_visitors || 0;
          if (entry.date === todayStr) {
            todayViews = entry.page_views || 0;
            todayVisitors = entry.unique_visitors || 0;
          }
        });

        setTodayPageViews(todayViews);
        setTodayUniqueVisitors(todayVisitors);
        setTotalPageViews(totalViews);
        setTotalUniqueVisitors(totalVisitors);
      } catch (err) {
        console.error('Failed to load mock traffic statistics:', err);
      }
    }
  };

  const fetchWebsiteSettings = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            const val = item.value;
            if (item.key === 'general') {
              setGenSiteName(val.siteName || 'Gloopo');
              setGenSiteTitle(val.siteTitle || 'Gloopo - Community-Driven Assets on Supra L1');
              setGenMetaDesc(val.metaDescription || 'Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.');
              setGenMaintenanceMode(val.maintenanceMode || false);
              setGenWhitepaperV1(val.whitepaperV1 || 'https://docs.gloopo.xyz/whitepaper-v1');
              setGenWhitepaperV2(val.whitepaperV2 || 'https://docs.gloopo.xyz/whitepaper-v2');
            } else if (item.key === 'about') {
              setAboutHeadline(val.headline || 'Who is Gloopo?');
              setAboutSubheadline(val.subheadline || 'Origin Story');
              setAboutDescription(val.description || 'Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration. More than just an asset, Gloopo is a narrative journey that transforms holders into explorers of the Supra ecosystem.');
              setTechCard1Icon(val.techCard1Icon || 'Zap');
              setTechCard1Title(val.techCard1Title || 'High Throughput');
              setTechCard1Desc(val.techCard1Desc || 'Low-latency consensus for a seamless experience.');
              setTechCard2Icon(val.techCard2Icon || 'RefreshCcw');
              setTechCard2Title(val.techCard2Title || 'Bridgeless');
              setTechCard2Desc(val.techCard2Desc || 'Strategic alignment with Supra\'s interoperability stack.');
              setTechCard3Icon(val.techCard3Icon || 'GraduationCap');
              setTechCard3Title(val.techCard3Title || 'Maturity');
              setTechCard3Desc(val.techCard3Desc || 'Proven graduation from the Atmos Protocol process.');
            } else if (item.key === 'tokenomics') {
              setTokenTicker(val.ticker || 'GLOOPO');
              setTokenTotalSupply(val.totalSupply || '1,000,000,000');
              setTokenLiquidityFee(val.liquidityFee || '2.0%');
              setTokenMarketingFee(val.marketingFee || '1.0%');
              setTokenChartData(val.chartData || [
                { label: 'Public Pool', percentage: 20, color: '#00FF88' },
                { label: 'LLIM Treasury', percentage: 20, color: '#10F090' },
                { label: 'Ecosystem', percentage: 20, color: '#20E198' },
                { label: 'Core Team', percentage: 10, color: '#30D2A0' },
                { label: 'Airdrop', percentage: 10, color: '#40C3A8' },
                { label: 'NFT Holders', percentage: 10, color: '#50B4B0' },
                { label: 'Treasury', percentage: 5, color: '#60A5B8' },
                { label: 'Strategic', percentage: 5, color: '#7096C0' }
              ]);
            } else if (item.key === 'socials') {
              setSocialTwitter(val.twitter || 'https://x.com/gloopo');
              setSocialTelegram(val.telegram || 'https://t.me/gloopo');
              setSocialDiscord(val.discord || 'https://discord.gg/gloopo');
            } else if (item.key === 'brandkit') {
              setBrandPrimary(val.primaryColor || '#00ff88');
              setBrandAccent(val.accentColor || '#bbff00');
              setBrandBackground(val.backgroundColor || '#030806');
              setBrandLogoPng(val.logoPngUrl || '/images/logo.png');
              setBrandLogoSvg(val.logoSvgPath || 'M12 2L2 22h20L12 2z');
              setBrandAssetsList(val.assetsList || DEFAULT_BRAND_ASSETS);
            } else if (item.key === 'roadmap') {
              setRoadmapPhases(val || [
                { phase: 'Phase 0', title: 'Preparation', status: 'completed', items: ['Token Studio creation', '75% pre-buy execution', 'Crystara NFT collection'] },
                { phase: 'Phase 1', title: 'Activation', status: 'completed', items: ['G/$S pool deployment', 'LLIM Activation', 'Liquidity top-ups'] },
                { phase: 'Phase 2', title: 'Dominance', status: 'active', items: ['Gen 1 NFT Launch', 'Social dominance campaign', 'Community expansion'] },
                { phase: 'Phase 3', title: 'Governance', status: 'pending', items: ['Lore expansion', 'Website integration', 'Gloopo DAO Launch'] },
                { phase: 'Phase 4', title: 'Expansion', status: 'pending', items: ['Final LLIM Deployment', 'Cross-chain reach', 'Supra Bridging'] }
              ]);
            } else if (item.key === 'buttons') {
              setShowConnectButton(val.showConnectButton !== false);
              setShowLoreMenu(val.showLore !== false);
              setShowTechMenu(val.showTech !== false);
              setShowTokenomicsMenu(val.showTokenomics !== false);
              setShowSwapMenu(val.showSwap !== false);
              setShowRoadmapMenu(val.showRoadmap !== false);
              setShowShowcaseMenu(val.showShowcase !== false);
              setShowBrandKitMenu(val.showBrandKit !== false);
            } else if (item.key === 'nfts') {
              setNftsMaintenanceMode(val.maintenanceMode !== false);
              setNftsCrystaraCreator(val.crystaraCreator || '');
              setNftsCrystaraCollection(val.crystaraCollection || '');
              setNftsCrystaraNetwork(val.crystaraNetwork || 'mainnet');
              setNftsOgpassCollection(val.ogpassCollection || '');
              setNftsOgpassMaintenance(val.ogpassMaintenance !== false);
              setNftsOgpassCreator(val.ogpassCreator || val.crystaraCreator || '');
              setNftsGen01Collection(val.gen01Collection || '');
              setNftsGen01Maintenance(val.gen01Maintenance !== undefined ? val.gen01Maintenance : val.maintenanceMode !== false);
              setNftsGen01Creator(val.gen01Creator || val.crystaraCreator || '');
              setNftsGen02Collection(val.gen02Collection || '');
              setNftsGen02Maintenance(val.gen02Maintenance !== false);
              setNftsGen02Creator(val.gen02Creator || val.crystaraCreator || '');
              setNftsGen03Collection(val.gen03Collection || '');
              setNftsGen03Maintenance(val.gen03Maintenance !== false);
              setNftsGen03Creator(val.gen03Creator || val.crystaraCreator || '');
            } else if (item.key === 'crystara_api_key') {
              setNftsCrystaraApiKey(val.apiKey || '');
            }
          });
        }
      } catch (err) {
        console.error('Failed to load live settings from Supabase:', err);
      }
    } else {
      // --- LOAD FROM LOCAL STORAGE MOCK ---
      const keys = ['general', 'about', 'tokenomics', 'socials', 'brandkit', 'roadmap', 'buttons', 'nfts', 'crystara_api_key'];
      keys.forEach(k => {
        const val = localStorage.getItem(`gloopo_mock_setting_${k}`);
        if (val) {
          const parsed = JSON.parse(val);
          if (k === 'general') {
            setGenSiteName(parsed.siteName || 'Gloopo');
            setGenSiteTitle(parsed.siteTitle || 'Gloopo - Community-Driven Assets on Supra L1');
            setGenMetaDesc(parsed.metaDescription || 'Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.');
            setGenMaintenanceMode(parsed.maintenanceMode || false);
            setGenWhitepaperV1(parsed.whitepaperV1 || 'https://docs.gloopo.xyz/whitepaper-v1');
            setGenWhitepaperV2(parsed.whitepaperV2 || 'https://docs.gloopo.xyz/whitepaper-v2');
          } else if (k === 'about') {
            setAboutHeadline(parsed.headline || 'Who is Gloopo?');
            setAboutSubheadline(parsed.subheadline || 'Origin Story');
            setAboutDescription(parsed.description || 'Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration. More than just an asset, Gloopo is a narrative journey that transforms holders into explorers of the Supra ecosystem.');
            setTechCard1Icon(parsed.techCard1Icon || 'Zap');
            setTechCard1Title(parsed.techCard1Title || 'High Throughput');
            setTechCard1Desc(parsed.techCard1Desc || 'Low-latency consensus for a seamless experience.');
            setTechCard2Icon(parsed.techCard2Icon || 'RefreshCcw');
            setTechCard2Title(parsed.techCard2Title || 'Bridgeless');
            setTechCard2Desc(parsed.techCard2Desc || 'Strategic alignment with Supra\'s interoperability stack.');
            setTechCard3Icon(parsed.techCard3Icon || 'GraduationCap');
            setTechCard3Title(parsed.techCard3Title || 'Maturity');
            setTechCard3Desc(parsed.techCard3Desc || 'Proven graduation from the Atmos Protocol process.');
          } else if (k === 'tokenomics') {
            setTokenTicker(parsed.ticker || 'GLOOPO');
            setTokenTotalSupply(parsed.totalSupply || '1,000,000,000');
            setTokenLiquidityFee(parsed.liquidityFee || '2.0%');
            setTokenMarketingFee(parsed.marketingFee || '1.0%');
            setTokenChartData(parsed.chartData || [
              { label: 'Public Pool', percentage: 20, color: '#00FF88' },
              { label: 'LLIM Treasury', percentage: 20, color: '#10F090' },
              { label: 'Ecosystem', percentage: 20, color: '#20E198' },
              { label: 'Core Team', percentage: 10, color: '#30D2A0' },
              { label: 'Airdrop', percentage: 10, color: '#40C3A8' },
              { label: 'NFT Holders', percentage: 10, color: '#50B4B0' },
              { label: 'Treasury', percentage: 5, color: '#60A5B8' },
              { label: 'Strategic', percentage: 5, color: '#7096C0' }
            ]);
          } else if (k === 'socials') {
            setSocialTwitter(parsed.twitter || 'https://x.com/gloopo');
            setSocialTelegram(parsed.telegram || 'https://t.me/gloopo');
            setSocialDiscord(parsed.discord || 'https://discord.gg/gloopo');
          } else if (k === 'brandkit') {
            setBrandPrimary(parsed.primaryColor || '#00ff88');
            setBrandAccent(parsed.accentColor || '#bbff00');
            setBrandBackground(parsed.backgroundColor || '#030806');
            setBrandLogoPng(parsed.logoPngUrl || '/images/logo.png');
            setBrandLogoSvg(parsed.logoSvgPath || 'M12 2L2 22h20L12 2z');
            setBrandAssetsList(parsed.assetsList || DEFAULT_BRAND_ASSETS);
          } else if (k === 'roadmap') {
            setRoadmapPhases(parsed || [
              { phase: 'Phase 0', title: 'Preparation', status: 'completed', items: ['Token Studio creation', '75% pre-buy execution', 'Crystara NFT collection'] },
              { phase: 'Phase 1', title: 'Activation', status: 'completed', items: ['G/$S pool deployment', 'LLIM Activation', 'Liquidity top-ups'] },
              { phase: 'Phase 2', title: 'Dominance', status: 'active', items: ['Gen 1 NFT Launch', 'Social dominance campaign', 'Community expansion'] },
              { phase: 'Phase 3', title: 'Governance', status: 'pending', items: ['Lore expansion', 'Website integration', 'Gloopo DAO Launch'] },
              { phase: 'Phase 4', title: 'Expansion', status: 'pending', items: ['Final LLIM Deployment', 'Cross-chain reach', 'Supra Bridging'] }
            ]);
          } else if (k === 'buttons') {
            setShowConnectButton(parsed.showConnectButton !== false);
            setShowLoreMenu(parsed.showLore !== false);
            setShowTechMenu(parsed.showTech !== false);
            setShowTokenomicsMenu(parsed.showTokenomics !== false);
            setShowSwapMenu(parsed.showSwap !== false);
            setShowRoadmapMenu(parsed.showRoadmap !== false);
            setShowShowcaseMenu(parsed.showShowcase !== false);
            setShowBrandKitMenu(parsed.showBrandKit !== false);
          } else if (k === 'nfts') {
            setNftsMaintenanceMode(parsed.maintenanceMode !== false);
            setNftsCrystaraCreator(parsed.crystaraCreator || '');
            setNftsCrystaraCollection(parsed.crystaraCollection || '');
            setNftsCrystaraNetwork(parsed.crystaraNetwork || 'mainnet');
            setNftsOgpassCollection(parsed.ogpassCollection || '');
            setNftsOgpassMaintenance(parsed.ogpassMaintenance !== false);
            setNftsOgpassCreator(parsed.ogpassCreator || parsed.crystaraCreator || '');
            setNftsGen01Collection(parsed.gen01Collection || '');
            setNftsGen01Maintenance(parsed.gen01Maintenance !== undefined ? parsed.gen01Maintenance : parsed.maintenanceMode !== false);
            setNftsGen01Creator(parsed.gen01Creator || parsed.crystaraCreator || '');
            setNftsGen02Collection(parsed.gen02Collection || '');
            setNftsGen02Maintenance(parsed.gen02Maintenance !== false);
            setNftsGen02Creator(parsed.gen02Creator || parsed.crystaraCreator || '');
            setNftsGen03Collection(parsed.gen03Collection || '');
            setNftsGen03Maintenance(parsed.gen03Maintenance !== false);
            setNftsGen03Creator(parsed.gen03Creator || parsed.crystaraCreator || '');
          } else if (k === 'crystara_api_key') {
            setNftsCrystaraApiKey(parsed.apiKey || '');
          }
        }
      });
    }
  };

  const handleSaveSettings = async (sectionKey: string, payload: any) => {
    setSaveLoading(sectionKey);
    setSaveSuccess(null);

    const sectionLabels: Record<string, string> = {
      about: 'About', general: 'General', tokenomics: 'Tokenomics',
      socials: 'Socials', brandkit: 'Brand Kit', buttons: 'Buttons',
      roadmap: 'Roadmap', nfts: 'NFTs Settings',
    };
    const label = sectionLabels[sectionKey] || sectionKey;

    try {
      if (isSupabaseConfigured && supabase) {
        // --- LIVE SUPABASE UPDATE ---
        const { error } = await supabase
          .from('website_settings')
          .upsert({ key: sectionKey, value: payload });

        if (error) throw error;
      } else {
        // --- SIMULATED MOCK UPDATE ---
        localStorage.setItem(`gloopo_mock_setting_${sectionKey}`, JSON.stringify(payload));
      }

      setSaveSuccess(sectionKey);
      showToast(`${label} settings saved successfully!`, 'success');
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
      const actionDetail = sectionKey === 'crystara_api_key' ? 'Updated Crystara API Key' : `Updated ${label} settings`;
      await logAdminAction('update_settings', actionDetail);
    } catch (err: any) {
      showToast(`Failed to save ${label}: ${err.message}`, 'error');
    } finally {
      setSaveLoading(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_current_tab');
    localStorage.removeItem('admin_settings_sub_tab');
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('gloopo_mock_admin_auth');
      localStorage.removeItem('gloopo_mock_admin_email');
    }
    router.push('/admin/login');
  };



  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhitelistAddress) return;

    const newEntry = {
      address: newWhitelistAddress,
      name: newWhitelistName || 'Community Member',
      addedAt: new Date().toISOString().split('T')[0],
      tier: newWhitelistTier
    };

    setWhitelist([newEntry, ...whitelist]);
    setNewWhitelistAddress('');
    setNewWhitelistName('');
    logAdminAction('add_whitelist', `Added address ${newWhitelistAddress} (${newWhitelistName || 'Community Member'}) to Whitelist`);
  };

  // --- ROADMAP CMS LIST BUILDER HELPERS ---
  const handleAddRoadmapItem = () => {
    if (!newPhaseItemText.trim()) return;
    setCurrentPhaseItems([...currentPhaseItems, newPhaseItemText.trim()]);
    setNewPhaseItemText('');
  };

  const handleRemoveRoadmapItem = (indexToRemove: number) => {
    setCurrentPhaseItems(currentPhaseItems.filter((_, i) => i !== indexToRemove));
  };

  const handleCreateRoadmapPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName || !newPhaseTitle) return;

    const newPhaseObj = {
      phase: newPhaseName,
      title: newPhaseTitle,
      status: newPhaseStatus,
      items: currentPhaseItems
    };

    const updatedPhases = [...roadmapPhases, newPhaseObj];
    setRoadmapPhases(updatedPhases);
    
    // Save directly to storage/DB
    handleSaveSettings('roadmap', updatedPhases);

    // Reset Creation Temp States
    setNewPhaseName('');
    setNewPhaseTitle('');
    setNewPhaseStatus('pending');
    setCurrentPhaseItems([]);
  };

  const handleDeleteRoadmapPhase = (phaseIndex: number) => {
    const updatedPhases = roadmapPhases.filter((_, i) => i !== phaseIndex);
    setRoadmapPhases(updatedPhases);
    handleSaveSettings('roadmap', updatedPhases);
  };

  // --- TOKENOMICS SLICE BUILDER HELPERS ---
  const handleAddTokenomicsSlice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSliceLabel.trim() || newSlicePct <= 0) return;

    const currentTotalPct = tokenChartData.reduce((sum, s) => sum + s.percentage, 0);
    const remainingPct = 100 - currentTotalPct;

    if (newSlicePct > remainingPct) {
      showToast(`Cannot exceed 100%. Max allowed: ${remainingPct}%`, 'warning');
      return;
    }

    const newSlice = {
      label: newSliceLabel.trim(),
      percentage: newSlicePct,
      color: newSliceColor
    };

    setTokenChartData([...tokenChartData, newSlice]);
    setNewSliceLabel('');
    setNewSlicePct(0);
    setNewSliceColor('#00ff88');
  };

  const handleDeleteTokenomicsSlice = (indexToRemove: number) => {
    setTokenChartData(tokenChartData.filter((_, i) => i !== indexToRemove));
  };

  const fetchPartnersList = async () => {
    if (isSupabaseConfigured && supabase) {
      setLoadingPartners(true);
      try {
        const { data, error } = await supabase.storage.from('partners').list('', {
          limit: 20,
          sortBy: { column: 'created_at', order: 'desc' }
        });
        if (error) throw error;
        if (data) {
          const files = data.filter(file => file.name !== '.emptyFolderPlaceholder');
          const mapped = files.slice(0, 10).map(file => {
            const { data: { publicUrl } } = supabase!.storage.from('partners').getPublicUrl(file.name);
            return {
              name: file.name,
              path: publicUrl,
              size: formatBytes(file.metadata?.size || 0)
            };
          });
          setPartnersList(mapped);
        }
      } catch (err) {
        console.error('Failed to load partners from storage:', err);
      } finally {
        setLoadingPartners(false);
      }
    } else {
      const val = localStorage.getItem('gloopo_mock_partners');
      if (val) {
        setPartnersList(JSON.parse(val));
      } else {
        const defaultMock = [
          { name: 'supra.png', path: '◇ Supra L1', size: '12 KB', isMock: true },
          { name: 'atmos.png', path: '◇ Atmos Protocol', size: '15 KB', isMock: true },
          { name: 'crystara.png', path: '◇ Crystara Labs', size: '18 KB', isMock: true },
          { name: 'slinky.png', path: '◇ Slinky Swap', size: '14 KB', isMock: true },
          { name: 'ventures.png', path: '◇ Gloopo Ventures', size: '20 KB', isMock: true }
        ];
        setPartnersList(defaultMock);
        localStorage.setItem('gloopo_mock_partners', JSON.stringify(defaultMock));
      }
    }
  };

  const handlePartnerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (partnersList.length >= 10) {
      showToast('Maximum 10 partners reached. Delete an existing logo first.', 'warning');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PNG, JPG, GIF, or SVG images are allowed.', 'error');
      return;
    }

    setUploadingField('partnerLogo');

    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}_partner.${fileExt}`;
        const filePath = uniqueFileName;

        const { data, error: uploadError } = await supabase.storage
          .from('partners')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        showToast('Partner logo uploaded successfully!', 'success');
        await fetchPartnersList();
        await logAdminAction('upload_partner', `Uploaded partner logo: ${file.name}`);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          const newPartner = {
            name: file.name,
            path: base64Data,
            size: formatBytes(file.size),
            isMock: true
          };
          const updated = [...partnersList, newPartner].slice(0, 10);
          setPartnersList(updated);
          localStorage.setItem('gloopo_mock_partners', JSON.stringify(updated));
          showToast('Logo saved locally (mock mode).', 'success');
          logAdminAction('upload_partner', `Uploaded partner logo (mock): ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Partner upload error:', err);
      showToast(`Upload failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleDeletePartner = async (partnerName: string, indexToRemove: number) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.storage
          .from('partners')
          .remove([partnerName]);

        if (error) throw error;
        showToast('Partner logo deleted successfully.', 'success');
        await fetchPartnersList();
        await logAdminAction('delete_partner', `Deleted partner logo: ${partnerName}`);
      } catch (err: any) {
        console.error('Failed to delete partner:', err);
        showToast(`Delete failed: ${err.message}`, 'error');
      }
    } else {
      const updated = partnersList.filter((_, i) => i !== indexToRemove);
      setPartnersList(updated);
      localStorage.setItem('gloopo_mock_partners', JSON.stringify(updated));
      showToast('Partner removed (mock mode).', 'success');
      logAdminAction('delete_partner', `Deleted partner logo (mock): ${partnerName}`);
    }
  };

  useEffect(() => {
    if (currentTab === 'settings' && settingsSubTab === 'partners') {
      fetchPartnersList();
    }
  }, [currentTab, settingsSubTab]);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleAddBrandAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim() || !newAssetPath) {
      showToast('Please enter a title and upload an asset file.', 'warning');
      return;
    }

    const newAsset = {
      title: newAssetTitle.trim(),
      desc: newAssetDesc.trim() || 'Official brand kit asset material.',
      format: newAssetFormat,
      dimensions: newAssetDimensions,
      size: newAssetSize || 'Dynamic Size',
      path: newAssetPath,
      filename: newAssetFilename || 'asset.png',
      storageFilename: newAssetStorageFilename || newAssetFilename || 'asset.png'
    };

    setBrandAssetsList([...brandAssetsList, newAsset]);

    // Reset Creation Temp States
    setNewAssetTitle('');
    setNewAssetDesc('');
    setNewAssetFormat('High-Res PNG');
    setNewAssetDimensions('2048 x 2048 px');
    setNewAssetSize('');
    setNewAssetPath('');
    setNewAssetFilename('');
    setNewAssetStorageFilename('');
  };

  const handleDeleteBrandAsset = async (indexToRemove: number) => {
    const assetToDelete = brandAssetsList[indexToRemove];

    // 1. If it has an uploaded Supabase Storage filename, delete it from bucket!
    if (assetToDelete && assetToDelete.storageFilename && isSupabaseConfigured && supabase) {
      try {
        const { error: deleteError } = await supabase.storage
          .from('brand-kit')
          .remove([assetToDelete.storageFilename]);

        if (deleteError) {
          console.error('Failed to delete storage object:', deleteError);
        } else {
          console.log(`Successfully deleted ${assetToDelete.storageFilename} from brand-kit storage bucket.`);
        }
      } catch (err) {
        console.error('Failed to clean up storage file:', err);
      }
    } else if (assetToDelete && assetToDelete.storageFilename) {
      // Mock mode local storage file clean up
      localStorage.removeItem(`gloopo_mock_file_${assetToDelete.storageFilename}`);
    }

    // 2. Remove from local list state
    setBrandAssetsList(brandAssetsList.filter((_, i) => i !== indexToRemove));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PNG, JPG, GIF, or SVG images are allowed.', 'error');
      return;
    }

    setUploadingField(fieldName);

    try {
      if (isSupabaseConfigured && supabase) {
        // If we already had a previous temp uploaded storage filename, delete it first to prevent orphaned files!
        if (fieldName === 'newBrandAsset' && newAssetStorageFilename) {
          try {
            await supabase.storage.from('brand-kit').remove([newAssetStorageFilename]);
            console.log(`Garbage-collected previous orphaned upload: ${newAssetStorageFilename}`);
          } catch (err) {
            console.error('Failed to garbage-collect orphaned upload:', err);
          }
        }

        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}_${fieldName}.${fileExt}`;
        const filePath = uniqueFileName;

        const { data, error: uploadError } = await supabase.storage
          .from('brand-kit')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('brand-kit')
          .getPublicUrl(filePath);

        if (fieldName === 'logoPng') {
          setBrandLogoPng(publicUrl);
        } else if (fieldName === 'newBrandAsset') {
          setNewAssetPath(publicUrl);
          setNewAssetFilename(file.name);
          setNewAssetStorageFilename(filePath);
          setNewAssetSize(formatBytes(file.size));
        }

        showToast('Image uploaded to brand-kit storage!', 'success');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          if (fieldName === 'logoPng') {
            setBrandLogoPng(base64Data);
          } else if (fieldName === 'newBrandAsset') {
            setNewAssetPath(base64Data);
            setNewAssetFilename(file.name);
            setNewAssetStorageFilename(file.name);
            setNewAssetSize(formatBytes(file.size));
          }
          
          localStorage.setItem(`gloopo_mock_file_${fieldName}`, base64Data);
          showToast('File loaded successfully (mock mode).', 'success');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      showToast(`Upload failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleWhitepaperUpload = async (event: React.ChangeEvent<HTMLInputElement>, version: 'v1' | 'v2') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are allowed for the whitepapers.', 'error');
      return;
    }

    const fieldName = `whitepaper_${version}`;
    setUploadingField(fieldName);

    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = 'pdf';
        const uniqueFileName = `${version}_whitepaper_${Date.now()}.${fileExt}`;
        const filePath = uniqueFileName;

        const { data, error: uploadError } = await supabase.storage
          .from('whitepaper')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('whitepaper')
          .getPublicUrl(filePath);

        if (version === 'v1') {
          setGenWhitepaperV1(publicUrl);
        } else {
          setGenWhitepaperV2(publicUrl);
        }

        showToast(`Whitepaper ${version.toUpperCase()} uploaded to storage successfully!`, 'success');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          if (version === 'v1') {
            setGenWhitepaperV1(base64Data);
          } else {
            setGenWhitepaperV2(base64Data);
          }
          
          localStorage.setItem(`gloopo_mock_file_${fieldName}`, base64Data);
          showToast(`Whitepaper ${version.toUpperCase()} loaded successfully (mock mode).`, 'success');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Whitepaper upload error:', err);
      showToast(`Upload failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const getInitials = (email: string) => {
    return email ? email.slice(0, 2).toUpperCase() : 'AD';
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: '#030806',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        {/* Background decorative glows */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(0, 255, 136, 0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          top: '20%',
          left: '30%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(187, 255, 0, 0.03)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          bottom: '20%',
          right: '30%',
          pointerEvents: 'none'
        }} />

        {/* Loading Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1
        }}>
          {/* Logo or Shield Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(0, 255, 136, 0.08)',
            border: '1px solid rgba(0, 255, 136, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
          }}>
            <Shield size={32} style={{ color: '#00ff88' }} />
          </div>

          {/* Spinner */}
          <div style={{
            width: '28px',
            height: '28px',
            border: '2px solid rgba(255,255,255,0.05)',
            borderTopColor: '#00ff88',
            borderRadius: '50%',
            marginBottom: '1rem',
            animation: 'spin 0.8s linear infinite'
          }} />

          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Securing Connection
          </p>
        </div>

        {/* Inline CSS for keyframes */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        ` }} />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="logout-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 className="logout-modal-title">Sign Out</h3>
            <p className="logout-modal-desc">Are you sure you want to sign out of the admin panel?</p>
            <div className="logout-modal-actions">
              <button className="logout-cancel-btn" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="logout-confirm-btn" onClick={() => { setShowLogoutModal(false); handleLogout(); }}>
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CLEAR LOGS CONFIRMATION MODAL ── */}
      {showClearLogsModal && (
        <div className="logout-overlay" onClick={() => setShowClearLogsModal(false)}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            <div className="logout-modal-icon" style={{ background: 'rgba(255, 60, 80, 0.08)', border: '1px solid rgba(255, 60, 80, 0.25)', color: '#ff3c50', boxShadow: '0 0 24px rgba(255, 60, 80, 0.15)' }}>
              <Trash2 size={24} />
            </div>
            <h3 className="logout-modal-title">Clear Activity Logs</h3>
            <p className="logout-modal-desc">Are you sure you want to clear all admin activity logs? This action is permanent and cannot be undone.</p>
            <div className="logout-modal-actions">
              <button className="logout-cancel-btn" onClick={() => setShowClearLogsModal(false)}>
                Cancel
              </button>
              <button 
                className="logout-confirm-btn" 
                onClick={async () => { 
                  setShowClearLogsModal(false); 
                  await executeClearLogs(); 
                }}
              >
                <Trash2 size={15} />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`partners-toast partners-toast--${toast.type}`} role="alert">
          <span className="toast-icon">
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="toast-progress" />
        </div>
      )}

      {/* Background Ornaments */}
      <div className="bg-decorations">
        <div className="glow-sphere main"></div>
        <div className="glow-sphere secondary"></div>
      </div>


      {/* LEFT SIDEBAR PANEL */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="logo-shield" style={{ overflow: 'hidden', padding: 0 }}>
            <img 
              src="https://xnpqbgmqbjxgvhsojlft.supabase.co/storage/v1/object/public/brand-kit/bafkreifass4k3wmarrl76bozj42r4dm3b2ixcsmfgwocq3wek3ue2hgaee.jpg" 
              alt="Gloopo Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <span className="platform-tag">GLOOPO CONTROL</span>
            <h2>Admin Hub</h2>
          </div>
        </div>

        <div className="connection-badge">
          <div className={`status-dot ${isSupabaseConfigured ? 'live' : 'mock'}`}></div>
          <span>{isSupabaseConfigured ? 'Supabase Live' : 'Mock Database'}</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => setCurrentTab('overview')} 
            className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Console Overview</span>
            <ChevronRight size={14} className="chevron" />
          </button>

          <button 
            onClick={() => setCurrentTab('settings')} 
            className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
          >
            <Sliders size={18} />
            <span>Website Settings</span>
            <ChevronRight size={14} className="chevron" />
          </button>

          <button 
            onClick={() => setCurrentTab('profile')} 
            className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Profile Settings</span>
            <ChevronRight size={14} className="chevron" />
          </button>

          <button 
            onClick={() => setCurrentTab('logs')} 
            className={`nav-item ${currentTab === 'logs' ? 'active' : ''}`}
          >
            <Activity size={18} />
            <span>Logs</span>
            <ChevronRight size={14} className="chevron" />
          </button>
          

        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="avatar-placeholder">
              <span>{getInitials(adminEmail)}</span>
            </div>
            <div className="admin-details">
              <span className="admin-role">Administrator</span>
              <span className="admin-email" title={adminEmail}>{adminEmail}</span>
            </div>
          </div>
          
          <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER AREA */}
      <main className="admin-main">
        {/* Top Mini Header */}
        <header className="main-header glass-card">
          <div className="header-breadcrumbs">
            <span className="muted-crumb">Admin Hub</span>
            <span className="divider">/</span>
            <span className="active-crumb">
              {currentTab === 'overview' && 'Console Overview'}
              {currentTab === 'settings' && 'Website Settings (CMS)'}
              {currentTab === 'profile' && 'Profile Settings'}
              {currentTab === 'logs' && 'Admin Activity Logs'}
            </span>
          </div>

          <div className="header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="header-btn" title="View Website">
              <Globe size={16} />
            </a>
            <span className="time-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
        </header>

        {/* Database Status Alert banner (Overview tab in Mock Mode) */}
        {!isSupabaseConfigured && currentTab === 'overview' && (
          <div className="mock-banner glass-card">
            <div className="banner-left">
              <div className="alert-icon-box">
                <Database size={22} />
              </div>
              <div>
                <h3>Database Running in Simulated Mock Mode</h3>
                <p>
                  The admin panel is using standard local state. To enable permanent storage for swaps, whitelist configurations, and event logs, integrate your live Supabase keys.
                </p>
              </div>
            </div>
            <button onClick={() => setCurrentTab('supabase')} className="btn-primary-sm-white">
              Connect Supabase
            </button>
          </div>
        )}

        {/* ACTIVE PANEL CONTENT ROUTER */}
        
        {/* 1. OVERVIEW PANEL */}
        {currentTab === 'overview' && (
          <div className="tab-content fade-in">
                {/* Level 1 Metrics Grid */}
                <div className="metrics-grid">
                  <div className="metric-box glass-card purple-theme">
                    <div className="metric-icon purple">
                      <Users size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="label">Active Admins</span>
                      <h2>{activeAdminsCount} Admins</h2>
                      <span className="change positive" style={{ color: 'var(--text-muted)' }}>
                        <span>Active in database</span>
                      </span>
                    </div>
                  </div>

                  <div className="metric-box glass-card blue-theme">
                    <div className="metric-icon blue" style={{ background: 'rgba(0, 150, 255, 0.08)', color: '#0096ff' }}>
                      <Eye size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="label">Total Page Views</span>
                      <h2>{totalPageViews.toLocaleString()}</h2>
                      <span className="change positive">
                        <TrendingUp size={12} />
                        <span>+{todayPageViews} today</span>
                      </span>
                    </div>
                  </div>

                  <div className="metric-box glass-card neon-theme">
                    <div className="metric-icon neon">
                      <Globe size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="label">Unique Visitors</span>
                      <h2>{todayUniqueVisitors}</h2>
                      <span className="change positive" style={{ color: 'var(--text-muted)' }}>
                        <span>{totalUniqueVisitors.toLocaleString()} total visitors</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bento Grid */}
                <div className="bento-grid dashboard-bento">
                  {/* Traffic Analytics Panel */}
                  <div className="glass-card bento-panel traffic-panel-quick" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 12' }}>
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={18} className="panel-icon" style={{ color: 'var(--primary)' }} />
                        <h3>Traffic Analytics</h3>
                      </div>
                      <span className="live-pill" style={{ background: 'rgba(0, 150, 255, 0.1)', color: '#0096ff', border: '1px solid rgba(0, 150, 255, 0.15)' }}>
                        <span className="dot" style={{ background: '#0096ff' }}></span>
                        <span>7D LOGS</span>
                      </span>
                    </div>

                    <div className="traffic-analytics-content">
                      <div className="chart-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* SVG Chart */}
                        <div style={{ position: 'relative', height: '180px', width: '100%', marginTop: '0.5rem' }}>
                          {trafficHistory.length > 0 ? (
                            <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2"/>
                                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0"/>
                                </linearGradient>
                                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#0096ff" stopOpacity="0.2"/>
                                  <stop offset="100%" stopColor="#0096ff" stopOpacity="0.0"/>
                                </linearGradient>
                              </defs>

                              {/* Grid Lines */}
                              <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                              <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                              <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                              {/* Page Views Area & Line */}
                              {(() => {
                                const maxViews = Math.max(...trafficHistory.map(h => h.page_views || 1), 1);
                                const points = trafficHistory.map((h, i) => {
                                  const x = (i / (trafficHistory.length - 1)) * 300;
                                  const y = 100 - ((h.page_views || 0) / maxViews) * 80;
                                  return `${x},${y}`;
                                }).join(' ');

                                const fillPoints = `0,100 ${points} 300,100`;

                                return (
                                  <>
                                    <polygon points={fillPoints} fill="url(#viewsGrad)" />
                                    <polyline points={points} fill="none" stroke="#00ff88" strokeWidth="2" />
                                  </>
                                );
                              })()}

                              {/* Unique Visitors Line */}
                              {(() => {
                                const maxVisitors = Math.max(...trafficHistory.map(h => h.unique_visitors || 1), 1);
                                const points = trafficHistory.map((h, i) => {
                                  const x = (i / (trafficHistory.length - 1)) * 300;
                                  const y = 100 - ((h.unique_visitors || 0) / maxVisitors) * 80;
                                  return `${x},${y}`;
                                }).join(' ');

                                return (
                                  <polyline points={points} fill="none" stroke="#0096ff" strokeWidth="1.5" strokeDasharray="3,3" />
                                );
                              })()}
                            </svg>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              No traffic history loaded
                            </div>
                          )}
                        </div>

                        {/* Chart Legend */}
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', marginTop: '-0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '2px' }} />
                            <span style={{ color: 'var(--text-muted)' }}>Page Views</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: '8px', height: '8px', border: '1.5px dashed #0096ff', borderRadius: '2px' }} />
                            <span style={{ color: 'var(--text-muted)' }}>Unique Visitors</span>
                          </div>
                        </div>
                      </div>

                      <div className="table-section">
                        {/* Small Breakdown Table */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                          <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <th style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>Views</th>
                                <th style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>Visitors</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trafficHistory.slice().reverse().map((h, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                  <td style={{ padding: '0.35rem 0.6rem', color: 'var(--text-muted)' }}>
                                    {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </td>
                                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'right', fontWeight: 600 }}>{h.page_views}</td>
                                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'right', color: '#0096ff' }}>{h.unique_visitors}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        )}

        {/* 2. CMS WEBSITE SETTINGS PANEL */}
        {currentTab === 'settings' && (
          <div className="tab-content fade-in">
            <div className="glass-card single-panel">
              <div className="panel-header-row">
                <div className="panel-header">
                  <Sliders size={20} className="panel-icon" />
                  <h3>Website Content Management (CMS)</h3>
                </div>
                
                {/* Visual indicator explaining mock database persistence */}
                {!isSupabaseConfigured && (
                  <span className="badge-alert-pill">
                    ⚡ LOCAL STORAGE ACTIVE (Mock Persistence)
                  </span>
                )}
              </div>
              <p className="panel-desc font-normal">Edit your landing page sections and content here. Changes sync directly to your database.</p>

              {/* CMS Sub Navigation Buttons */}
              <div className="cms-sub-tabs">
                <button 
                  onClick={() => setSettingsSubTab('about')} 
                  className={`cms-tab-btn ${settingsSubTab === 'about' ? 'active' : ''}`}
                >
                  <Info size={14} />
                  <span>About</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('tokenomics')} 
                  className={`cms-tab-btn ${settingsSubTab === 'tokenomics' ? 'active' : ''}`}
                >
                  <TrendingUp size={14} />
                  <span>Tokenomics</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('socials')} 
                  className={`cms-tab-btn ${settingsSubTab === 'socials' ? 'active' : ''}`}
                >
                  <LinkIcon size={14} />
                  <span>Social Media</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('brandkit')} 
                  className={`cms-tab-btn ${settingsSubTab === 'brandkit' ? 'active' : ''}`}
                >
                  <Palette size={14} />
                  <span>Brand Kit</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('roadmap')} 
                  className={`cms-tab-btn ${settingsSubTab === 'roadmap' ? 'active' : ''}`}
                >
                  <Compass size={14} />
                  <span>Roadmap</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('general')} 
                  className={`cms-tab-btn ${settingsSubTab === 'general' ? 'active' : ''}`}
                >
                  <Globe size={14} />
                  <span>General/SEO</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('buttons')} 
                  className={`cms-tab-btn ${settingsSubTab === 'buttons' ? 'active' : ''}`}
                >
                  <Sliders size={14} />
                  <span>Navbar Buttons</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('nfts')} 
                  className={`cms-tab-btn ${settingsSubTab === 'nfts' ? 'active' : ''}`}
                >
                  <ImageIcon size={14} />
                  <span>NFTs Settings</span>
                </button>
                <button 
                  onClick={() => setSettingsSubTab('partners')} 
                  className={`cms-tab-btn ${settingsSubTab === 'partners' ? 'active' : ''}`}
                >
                  <Users size={14} />
                  <span>Partners</span>
                </button>

              </div>

              <div className="divider-h small"></div>

              {/* CMS FORMS PANEL BUILDER */}
              <div className="cms-form-body">
                
                {/* A. ABOUT FORM */}
                {settingsSubTab === 'about' && (
                  <div className="cms-tab-view fade-in">
                    <div className="cms-grid-layout">
                      <div className="cms-form-fields">
                        <div className="cms-group">
                          <label>Landing Headline</label>
                          <input 
                            type="text" 
                            value={aboutHeadline} 
                            onChange={(e) => setAboutHeadline(e.target.value)} 
                            className="flat-input"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Landing Sub-Headline</label>
                          <input 
                            type="text" 
                            value={aboutSubheadline} 
                            onChange={(e) => setAboutSubheadline(e.target.value)} 
                            className="flat-input"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Headline Paragraph / Description</label>
                          <textarea 
                            value={aboutDescription} 
                            onChange={(e) => setAboutDescription(e.target.value)} 
                            className="flat-input large-area"
                          />
                        </div>

                        <div className="divider-h" style={{ margin: '2rem 0' }}></div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech Cards (Homepage Section)</h4>

                        {/* Tech Card 1 */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <h5 style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)' }}>Card 1</h5>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div className="cms-group" style={{ flex: '0 0 200px' }}>
                              <label>Icon</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                  color: 'var(--primary)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  background: 'rgba(255,255,255,0.05)', 
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '8px', 
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  flexShrink: 0
                                }}>
                                  {(() => {
                                    const Icon = techIconMap[techCard1Icon] || Zap;
                                    return <Icon size={20} />;
                                  })()}
                                </div>
                                <CustomDropdown
                                  value={techCard1Icon}
                                  onChange={(val) => setTechCard1Icon(val)}
                                  options={TECH_ICON_OPTIONS}
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                            <div className="cms-group" style={{ flex: 1 }}>
                              <label>Title</label>
                              <input 
                                type="text" 
                                value={techCard1Title} 
                                onChange={(e) => setTechCard1Title(e.target.value)}
                                className="flat-input"
                              />
                            </div>
                          </div>
                          <div className="cms-group">
                            <label>Description</label>
                            <input 
                              type="text" 
                              value={techCard1Desc} 
                              onChange={(e) => setTechCard1Desc(e.target.value)}
                              className="flat-input"
                            />
                          </div>
                        </div>

                        {/* Tech Card 2 */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <h5 style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)' }}>Card 2</h5>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div className="cms-group" style={{ flex: '0 0 200px' }}>
                              <label>Icon</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                  color: 'var(--primary)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  background: 'rgba(255,255,255,0.05)', 
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '8px', 
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  flexShrink: 0
                                }}>
                                  {(() => {
                                    const Icon = techIconMap[techCard2Icon] || RefreshCcw;
                                    return <Icon size={20} />;
                                  })()}
                                </div>
                                <CustomDropdown
                                  value={techCard2Icon}
                                  onChange={(val) => setTechCard2Icon(val)}
                                  options={TECH_ICON_OPTIONS}
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                            <div className="cms-group" style={{ flex: 1 }}>
                              <label>Title</label>
                              <input 
                                type="text" 
                                value={techCard2Title} 
                                onChange={(e) => setTechCard2Title(e.target.value)}
                                className="flat-input"
                              />
                            </div>
                          </div>
                          <div className="cms-group">
                            <label>Description</label>
                            <input 
                              type="text" 
                              value={techCard2Desc} 
                              onChange={(e) => setTechCard2Desc(e.target.value)}
                              className="flat-input"
                            />
                          </div>
                        </div>

                        {/* Tech Card 3 */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <h5 style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)' }}>Card 3</h5>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div className="cms-group" style={{ flex: '0 0 200px' }}>
                              <label>Icon</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                  color: 'var(--primary)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  background: 'rgba(255,255,255,0.05)', 
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '8px', 
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  flexShrink: 0
                                }}>
                                  {(() => {
                                    const Icon = techIconMap[techCard3Icon] || GraduationCap;
                                    return <Icon size={20} />;
                                  })()}
                                </div>
                                <CustomDropdown
                                  value={techCard3Icon}
                                  onChange={(val) => setTechCard3Icon(val)}
                                  options={TECH_ICON_OPTIONS}
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                            <div className="cms-group" style={{ flex: 1 }}>
                              <label>Title</label>
                              <input 
                                type="text" 
                                value={techCard3Title} 
                                onChange={(e) => setTechCard3Title(e.target.value)}
                                className="flat-input"
                              />
                            </div>
                          </div>
                          <div className="cms-group">
                            <label>Description</label>
                            <input 
                              type="text" 
                              value={techCard3Desc} 
                              onChange={(e) => setTechCard3Desc(e.target.value)}
                              className="flat-input"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSaveSettings('about', { 
                            headline: aboutHeadline, 
                            subheadline: aboutSubheadline, 
                            description: aboutDescription,
                            techCard1Icon,
                            techCard1Title,
                            techCard1Desc,
                            techCard2Icon,
                            techCard2Title,
                            techCard2Desc,
                            techCard3Icon,
                            techCard3Title,
                            techCard3Desc
                          })}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'about'}
                        >
                          {saveLoading === 'about' ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'about' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save About & Tech Section</span></>
                          )}
                        </button>
                      </div>

                      {/* Live preview */}
                      <div className="cms-live-preview">
                        <span className="preview-header">LIVE CMS LAYOUT PREVIEW</span>
                        <div className="preview-card-frame">
                          <span className="p-tagline">ABOUT GLOOPO</span>
                          <h3 className="p-headline">{aboutHeadline || 'No Headline set'}</h3>
                          <span className="p-subheadline">{aboutSubheadline}</span>
                          <p className="p-paragraph">{aboutDescription || 'No description written yet.'}</p>
                          
                          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tech Cards Preview</span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {[
                                { icon: techCard1Icon, title: techCard1Title, desc: techCard1Desc },
                                { icon: techCard2Icon, title: techCard2Title, desc: techCard2Desc },
                                { icon: techCard3Icon, title: techCard3Title, desc: techCard3Desc }
                              ].map((card, idx) => {
                                const IconComponent = techIconMap[card.icon] || Zap;
                                return (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                                      <IconComponent size={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                      <h5 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{card.title || 'No Title'}</h5>
                                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{card.desc || 'No description'}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. TOKENOMICS FORM */}
                {settingsSubTab === 'tokenomics' && (() => {
                  const currentTotalPct = tokenChartData.reduce((sum, s) => sum + s.percentage, 0);
                  const remainingPct = Math.max(0, 100 - currentTotalPct);

                  return (
                    <div className="cms-tab-view fade-in">
                      <div className="cms-grid-layout">
                        <div className="cms-form-fields">
                          <div className="form-horizontal-row">
                            <div className="cms-group flex-1">
                              <label>Token Ticker Symbol</label>
                              <input 
                                type="text" 
                                value={tokenTicker} 
                                onChange={(e) => setTokenTicker(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            
                            <div className="cms-group flex-1">
                              <label>Total Supply Cap</label>
                              <input 
                                type="text" 
                                value={tokenTotalSupply} 
                                onChange={(e) => setTokenTotalSupply(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                          </div>

                          <div className="form-horizontal-row">
                            <div className="cms-group flex-1">
                              <label>Liquidity Pool Swap Fee</label>
                              <input 
                                type="text" 
                                value={tokenLiquidityFee} 
                                onChange={(e) => setTokenLiquidityFee(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            
                            <div className="cms-group flex-1">
                              <label>Marketing &amp; DAO Fee</label>
                              <input 
                                type="text" 
                                value={tokenMarketingFee} 
                                onChange={(e) => setTokenMarketingFee(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                          </div>

                          {/* Allocation Gauge */}
                          <div className="gauge-container" style={{ margin: '1rem 0', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>TOTAL ALLOCATION POOL</span>
                              <span style={{ color: currentTotalPct === 100 ? 'var(--primary)' : currentTotalPct > 100 ? '#ff4d4d' : '#ff9f43' }}>
                                {currentTotalPct}% / 100%
                              </span>
                            </div>
                            <div className="gauge-bar" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                              {tokenChartData.map((slice, index) => (
                                <div 
                                  key={index} 
                                  style={{ 
                                    width: `${slice.percentage}%`, 
                                    height: '100%', 
                                    backgroundColor: slice.color,
                                    transition: 'width 0.3s ease'
                                  }} 
                                  title={`${slice.label}: ${slice.percentage}%`}
                                />
                              ))}
                            </div>
                            {currentTotalPct !== 100 && (
                              <span style={{ fontSize: '0.72rem', color: '#ff9f43', marginTop: '0.5rem', display: 'block', fontWeight: 700 }}>
                                {currentTotalPct < 100 
                                  ? `⚠️ Remaining unallocated percentage: ${100 - currentTotalPct}%` 
                                  : `❌ Allocation exceeds 100% limit! Excess: ${currentTotalPct - 100}%`}
                              </span>
                            )}
                          </div>

                          {/* Adjusting slices */}
                          <div className="cms-group">
                            <label>Chart Distributions Slices ({tokenChartData.length})</label>
                            <div className="chart-slices-builder">
                              {tokenChartData.map((slice, index) => (
                                <div key={index} className="slice-row">
                                  <span className="slice-color-indicator" style={{ backgroundColor: slice.color }}></span>
                                  <input 
                                    type="text" 
                                    value={slice.label} 
                                    onChange={(e) => {
                                      const updated = [...tokenChartData];
                                      updated[index].label = e.target.value;
                                      setTokenChartData(updated);
                                    }}
                                    className="flat-input slice-name"
                                  />
                                  <input 
                                    type="number" 
                                    value={slice.percentage} 
                                    onChange={(e) => {
                                      const updated = [...tokenChartData];
                                      const otherSum = tokenChartData.reduce((sum, s, i) => i === index ? sum : sum + s.percentage, 0);
                                      const allowedMax = 100 - otherSum;
                                      updated[index].percentage = Math.min(Math.max(Number(e.target.value), 0), allowedMax);
                                      setTokenChartData(updated);
                                    }}
                                    className="flat-input slice-pct"
                                    max={100 - tokenChartData.reduce((sum, s, i) => i === index ? sum : sum + s.percentage, 0)}
                                    min={0}
                                  />
                                  <span className="pct-unit">%</span>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTokenomicsSlice(index)}
                                    className="staged-del"
                                    style={{ padding: '0.4rem', border: 'none', cursor: 'pointer' }}
                                    title="Delete Slice"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Form to add new slice */}
                          <div className="whitelist-form-box roadmap-form-box" style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}>
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#fff' }}>Add New Allocation Slice</h4>
                            <div className="flat-form-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                              <div className="input-field-col" style={{ flex: '1', minWidth: '150px' }}>
                                <label style={{ fontSize: '0.68rem' }}>Allocation Label / Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Strategic Seed" 
                                  value={newSliceLabel}
                                  onChange={(e) => setNewSliceLabel(e.target.value)}
                                  className="flat-input"
                                />
                              </div>
                              
                              <div className="input-field-col" style={{ width: '80px', flex: 'none' }}>
                                <label style={{ fontSize: '0.68rem' }}>Color</label>
                                <div className="color-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                                  <input 
                                    type="color" 
                                    value={newSliceColor}
                                    onChange={(e) => setNewSliceColor(e.target.value)}
                                    className="color-dot-picker"
                                    style={{ width: '42px', height: '42px', padding: 0 }}
                                  />
                                </div>
                              </div>

                              <div className="input-field-col" style={{ width: '120px', flex: 'none' }}>
                                <label style={{ fontSize: '0.68rem' }}>Percentage (%)</label>
                                <div className="input-with-suffix">
                                  <input 
                                    type="number" 
                                    placeholder={`Max ${remainingPct}`}
                                    value={newSlicePct || ''}
                                    onChange={(e) => {
                                      const inputVal = Number(e.target.value);
                                      setNewSlicePct(Math.min(Math.max(inputVal, 0), remainingPct));
                                    }}
                                    className="flat-input"
                                    max={remainingPct}
                                    min={0}
                                  />
                                  <span className="suffix">%</span>
                                </div>
                              </div>

                              <button 
                                type="button" 
                                onClick={handleAddTokenomicsSlice} 
                                className="flat-add-btn height-flat"
                                disabled={remainingPct <= 0 || !newSliceLabel.trim() || newSlicePct <= 0}
                                style={{ minHeight: '42px' }}
                              >
                                <Plus size={16} />
                                <span>Add Slice</span>
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleSaveSettings('tokenomics', { ticker: tokenTicker, totalSupply: tokenTotalSupply, liquidityFee: tokenLiquidityFee, marketingFee: tokenMarketingFee, chartData: tokenChartData })}
                            className="flat-save-btn btn-primary"
                            disabled={saveLoading === 'tokenomics' || currentTotalPct !== 100}
                            style={{ marginTop: '1.5rem' }}
                          >
                            {saveLoading === 'tokenomics' ? (
                              <span className="spinner-white"></span>
                            ) : saveSuccess === 'tokenomics' ? (
                              <><Check size={16} /><span>Saved Successfully!</span></>
                            ) : (
                              <><Save size={16} /><span>Save Tokenomics Config</span></>
                            )}
                          </button>
                          {currentTotalPct !== 100 && (
                            <span style={{ fontSize: '0.72rem', color: '#ff4d4d', display: 'block', marginTop: '0.5rem', fontWeight: 700 }}>
                              * The total allocation must sum up to exactly 100% to save configuration to the database.
                            </span>
                          )}
                        </div>

                        {/* Live preview */}
                        <div className="cms-live-preview">
                          <span className="preview-header">TOKENOMICS PREVIEW</span>
                          <div className="preview-card-frame">
                            <div className="preview-stat-row">
                              <div>
                                <span className="p-muted">Ticker</span>
                                <p className="p-bold var-green">{tokenTicker}</p>
                              </div>
                              <div>
                                <span className="p-muted">Total Supply</span>
                                <p className="p-bold">{tokenTotalSupply}</p>
                              </div>
                            </div>
                            
                            <div className="preview-stat-row bottom-pad">
                              <div>
                                <span className="p-muted">LP Swap Fee</span>
                                <p className="p-bold">{tokenLiquidityFee}</p>
                              </div>
                              <div>
                                <span className="p-muted">DAO Fee</span>
                                <p className="p-bold">{tokenMarketingFee}</p>
                              </div>
                            </div>

                            <span className="p-muted-header">DISTRIBUTION LEDGER</span>
                            <div className="distribution-ledger-list">
                              {tokenChartData.map((slice, index) => (
                                <div key={index} className="ledger-item">
                                  <span className="dot" style={{ backgroundColor: slice.color }}></span>
                                  <span className="ledger-label">{slice.label}</span>
                                  <span className="ledger-pct font-mono">{slice.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* C. SOCIAL MEDIA FORM */}
                {settingsSubTab === 'socials' && (
                  <div className="cms-tab-view fade-in">
                    <div className="cms-grid-layout">
                      <div className="cms-form-fields max-w-full">
                        <div className="cms-group">
                          <label>Twitter / X Profile URL</label>
                          <input 
                            type="text" 
                            value={socialTwitter} 
                            onChange={(e) => setSocialTwitter(e.target.value)} 
                            className="flat-input font-mono"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Telegram Group/Channel Link</label>
                          <input 
                            type="text" 
                            value={socialTelegram} 
                            onChange={(e) => setSocialTelegram(e.target.value)} 
                            className="flat-input font-mono"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Discord Invitation Link</label>
                          <input 
                            type="text" 
                            value={socialDiscord} 
                            onChange={(e) => setSocialDiscord(e.target.value)} 
                            className="flat-input font-mono"
                          />
                        </div>

                        <button 
                          onClick={() => handleSaveSettings('socials', { twitter: socialTwitter, telegram: socialTelegram, discord: socialDiscord })}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'socials'}
                        >
                          {saveLoading === 'socials' ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'socials' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save Social Media Handles</span></>
                          )}
                        </button>
                      </div>

                      {/* Informational Widget */}
                      <div className="cms-live-preview">
                        <span className="preview-header">SOCIAL MEDIA LINKS UTILITY</span>
                        <div className="preview-card-frame border-light">
                          <p className="p-paragraph font-sm line-loose">
                            These links will instantly control the anchor references inside the main website **Footer** (X/Twitter, Telegram, Discord buttons) and **Navbar** links. <br /><br />
                            Make sure to always write absolute protocols (e.g. <code>https://</code>) to prevent invalid relative paths in the client dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* D. BRAND KIT FORM */}
                {settingsSubTab === 'brandkit' && (
                  <div className="cms-tab-view fade-in">
                    <div className="cms-grid-layout">
                      <div className="cms-form-fields">



                                      {/* Dynamic Brand Assets Section */}
                        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={18} style={{ color: 'var(--primary)' }} />
                            <span>Downloadable Brand Assets ({brandAssetsList.length})</span>
                          </h4>

                          {/* List of current dynamic assets */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {brandAssetsList.length === 0 ? (
                              <div style={{ 
                                padding: '2rem', 
                                textAlign: 'center', 
                                background: 'rgba(255,255,255,0.01)', 
                                border: '1px dashed rgba(255,255,255,0.05)', 
                                borderRadius: '12px',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem'
                              }}>
                                No downloadable brand assets added yet. Use the form below to add assets.
                              </div>
                            ) : (
                              brandAssetsList.map((asset, idx) => (
                                <div key={idx} style={{ 
                                  background: 'rgba(255,255,255,0.02)', 
                                  border: '1px solid rgba(255,255,255,0.05)', 
                                  borderRadius: '12px', 
                                  padding: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '1rem'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                      width: '48px', 
                                      height: '48px', 
                                      borderRadius: '8px', 
                                      background: '#020604', 
                                      border: '1px solid rgba(255,255,255,0.05)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      overflow: 'hidden'
                                    }}>
                                      <img src={asset.path} alt={asset.title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{asset.title}</span>
                                        <span style={{ 
                                          fontSize: '0.65rem', 
                                          fontWeight: 800, 
                                          color: 'var(--primary)', 
                                          background: 'rgba(0, 255, 136, 0.08)',
                                          padding: '0.15rem 0.4rem',
                                          borderRadius: '4px',
                                          border: '1px solid rgba(0, 255, 136, 0.15)'
                                        }}>{asset.format}</span>
                                      </div>

                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteBrandAsset(idx)}
                                    style={{ 
                                      background: 'rgba(255, 64, 64, 0.08)', 
                                      border: '1px solid rgba(255, 64, 64, 0.2)', 
                                      color: '#ff4444', 
                                      padding: '0.5rem', 
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      transition: 'all 0.2s ease',
                                      outline: 'none'
                                    }}
                                    title="Delete Asset"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Sub-form to Add New Asset */}
                          <div style={{ 
                            background: 'rgba(255,255,255,0.01)', 
                            border: '1px solid rgba(255,255,255,0.04)', 
                            borderRadius: '16px', 
                            padding: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Add New Brand Asset Material
                            </h5>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                              <div className="cms-group" style={{ margin: 0 }}>
                                <label>Asset Title *</label>
                                <input 
                                  type="text" 
                                  value={newAssetTitle} 
                                  onChange={(e) => setNewAssetTitle(e.target.value)} 
                                  placeholder="e.g. Gloopo 3D Mascot Character"
                                  className="flat-input"
                                />
                              </div>
                              <div className="cms-group" style={{ margin: 0 }}>
                                <label>Asset Format / Badge</label>
                                <CustomDropdown
                                  value={newAssetFormat}
                                  onChange={(val) => setNewAssetFormat(val)}
                                  options={ASSET_FORMAT_OPTIONS}
                                />
                              </div>
                            </div>

                            <div className="cms-group" style={{ marginBottom: '1.5rem' }}>
                              <label>Asset Image File *</label>
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <input 
                                  type="text" 
                                  value={newAssetPath} 
                                  onChange={(e) => setNewAssetPath(e.target.value)} 
                                  placeholder="Upload asset file or paste image URL"
                                  className="flat-input font-mono"
                                  style={{ flex: 1 }}
                                />
                                <label className="flat-upload-label" style={{ 
                                  background: uploadingField === 'newBrandAsset' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 136, 0.08)',
                                  border: '1px dashed rgba(0, 255, 136, 0.3)',
                                  color: 'var(--primary)',
                                  padding: '0.8rem 1.2rem',
                                  borderRadius: '8px',
                                  cursor: uploadingField ? 'not-allowed' : 'pointer',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  whiteSpace: 'nowrap'
                                }}>
                                  <Upload size={14} />
                                  {uploadingField === 'newBrandAsset' ? 'Uploading...' : 'Upload File'}
                                  <input 
                                    type="file" 
                                    onChange={(e) => handleFileUpload(e, 'newBrandAsset')} 
                                    accept="image/*" 
                                    style={{ display: 'none' }}
                                    disabled={!!uploadingField}
                                  />
                                </label>
                              </div>
                              {newAssetFilename && (
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
                                  <span>Filename: <strong>{newAssetFilename}</strong></span>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={handleAddBrandAsset}
                              className="flat-save-btn btn-secondary"
                              style={{ width: 'auto', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                            >
                              <Plus size={14} />
                              <span>Add Asset to List</span>
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSaveSettings('brandkit', { 
                            primaryColor: brandPrimary, 
                            accentColor: brandAccent, 
                            backgroundColor: brandBackground, 
                            logoPngUrl: brandLogoPng, 
                            logoSvgPath: brandLogoSvg,
                            assetsList: brandAssetsList
                          })}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'brandkit' || !!uploadingField}
                        >
                          {saveLoading === 'brandkit' ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'brandkit' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save Brand Kit Configurations</span></>
                          )}
                        </button>
                      </div>

                      {/* Brand Assets CMS Info Widget */}
                      <div className="cms-live-preview">
                        <span className="preview-header">BRAND KIT DOWNLOADS HUB</span>
                        <div className="preview-card-frame border-light">
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>Admin Assets Policy</h5>
                          <p className="p-paragraph font-sm line-loose" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                            The assets added to this repository are stored in the public <code>brand-kit</code> storage bucket on Supabase.
                          </p>
                          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.8rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
                            <li>Upload clean file sizes (PNG, SVG, or high-quality GIFs are highly recommended).</li>
                            <li>These downloadable assets are instantly fetched by the public <a href="/brand-assets" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Brand Assets</a> page.</li>
                            <li>The page layout automatically scales to match any quantity of elements uploaded by the administrator.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* E. ROADMAP TIMELINE FORM */}
                {settingsSubTab === 'roadmap' && (
                  <div className="cms-tab-view fade-in">
                    <div className="roadmap-cms-wrapper">
                      
                      {/* Form to create new Phase */}
                      <form onSubmit={handleCreateRoadmapPhase} className="whitelist-form-box roadmap-form-box">
                        <h4>Create New Roadmap Phase</h4>
                        <div className="flat-form-row">
                          <div className="input-field-col min-w-120">
                            <label>Phase Code</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Phase 4" 
                              value={newPhaseName}
                              onChange={(e) => setNewPhaseName(e.target.value)}
                              className="flat-input"
                              required
                            />
                          </div>

                          <div className="input-field-col flex-2 min-w-160">
                            <label>Phase Headline Title</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Governance &amp; DAO" 
                              value={newPhaseTitle}
                              onChange={(e) => setNewPhaseTitle(e.target.value)}
                              className="flat-input"
                              required
                            />
                          </div>

                          <div className="input-field-col min-w-120">
                            <label>Operational Status</label>
                            <CustomDropdown
                              value={newPhaseStatus}
                              onChange={(val) => setNewPhaseStatus(val as any)}
                              options={ROADMAP_STATUS_OPTIONS}
                            />
                          </div>
                        </div>

                        {/* Bullets lists manager */}
                        <div className="bullets-manager-box">
                          <label>Phase Milestone Bullets</label>
                          <div className="bullet-adder-row">
                            <input 
                              type="text" 
                              placeholder="Add milestone bullet text..." 
                              value={newPhaseItemText}
                              onChange={(e) => setNewPhaseItemText(e.target.value)}
                              className="flat-input"
                            />
                            <button type="button" onClick={handleAddRoadmapItem} className="flat-add-btn height-flat">
                              Add Bullet
                            </button>
                          </div>

                          {currentPhaseItems.length > 0 && (
                            <div className="bullets-staged-list">
                              {currentPhaseItems.map((item, index) => (
                                <div key={index} className="staged-item">
                                  <span>• {item}</span>
                                  <button type="button" onClick={() => handleRemoveRoadmapItem(index)} className="staged-del">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button type="submit" className="flat-save-btn btn-primary spacing-top">
                          <Plus size={16} />
                          <span>Publish Roadmap Phase</span>
                        </button>
                      </form>

                      {/* Display active list */}
                      <div className="divider-h"></div>
                      
                      <div className="roadmap-phases-cms-list">
                        <h4>Active Roadmap Phases ({roadmapPhases.length})</h4>
                        
                        <div className="roadmap-timeline-vertical">
                          {roadmapPhases.map((phase, index) => (
                            <div key={index} className={`roadmap-node-card ${phase.status}`}>
                              <div className="node-meta-row">
                                <span className="node-phase font-mono">{phase.phase}</span>
                                <span className={`node-status ${phase.status}`}>{phase.status}</span>
                                
                                <button 
                                  onClick={() => handleDeleteRoadmapPhase(index)}
                                  className="node-delete-btn" 
                                  title="Delete Phase"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <h5 className="node-title">{phase.title}</h5>
                              <ul className="node-items-list">
                                {phase.items.map((item, bulletIdx) => (
                                  <li key={bulletIdx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* F. GENERAL / SEO FORM */}
                {settingsSubTab === 'general' && (
                  <div className="cms-tab-view fade-in">
                    <div className="cms-grid-layout">
                      <div className="cms-form-fields max-w-full">
                        <div className="cms-group">
                          <label>Platform / Brand Name</label>
                          <input 
                            type="text" 
                            value={genSiteName} 
                            onChange={(e) => setGenSiteName(e.target.value)} 
                            className="flat-input"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Homepage Browser Tab Title (SEO Title)</label>
                          <input 
                            type="text" 
                            value={genSiteTitle} 
                            onChange={(e) => setGenSiteTitle(e.target.value)} 
                            className="flat-input"
                          />
                        </div>

                        <div className="cms-group">
                          <label>SEO Meta Description</label>
                          <textarea 
                            value={genMetaDesc} 
                            onChange={(e) => setGenMetaDesc(e.target.value)} 
                            className="flat-input medium-area"
                          />
                        </div>

                        <div className="cms-group">
                          <label>Whitepaper V1 URL</label>
                          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            <input 
                              type="text" 
                              value={genWhitepaperV1} 
                              onChange={(e) => setGenWhitepaperV1(e.target.value)} 
                              className="flat-input"
                              style={{ flex: 1 }}
                              placeholder="https://docs.gloopo.xyz/whitepaper-v1"
                            />
                            <label className="flat-upload-label" style={{ 
                              background: uploadingField === 'whitepaper_v1' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 136, 0.08)',
                              border: '1px dashed rgba(0, 255, 136, 0.3)',
                              color: 'var(--primary)',
                              padding: '0 1.5rem',
                              borderRadius: '8px',
                              cursor: uploadingField ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              whiteSpace: 'nowrap',
                              borderStyle: 'dashed'
                            }}>
                              <Upload size={16} />
                              {uploadingField === 'whitepaper_v1' ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                onChange={(e) => handleWhitepaperUpload(e, 'v1')} 
                                accept="application/pdf" 
                                style={{ display: 'none' }}
                                disabled={!!uploadingField}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="cms-group">
                          <label>Whitepaper V2 URL</label>
                          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            <input 
                              type="text" 
                              value={genWhitepaperV2} 
                              onChange={(e) => setGenWhitepaperV2(e.target.value)} 
                              className="flat-input"
                              style={{ flex: 1 }}
                              placeholder="https://docs.gloopo.xyz/whitepaper-v2"
                            />
                            <label className="flat-upload-label" style={{ 
                              background: uploadingField === 'whitepaper_v2' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 136, 0.08)',
                              border: '1px dashed rgba(0, 255, 136, 0.3)',
                              color: 'var(--primary)',
                              padding: '0 1.5rem',
                              borderRadius: '8px',
                              cursor: uploadingField ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              whiteSpace: 'nowrap',
                              borderStyle: 'dashed'
                            }}>
                              <Upload size={16} />
                              {uploadingField === 'whitepaper_v2' ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                onChange={(e) => handleWhitepaperUpload(e, 'v2')} 
                                accept="application/pdf" 
                                style={{ display: 'none' }}
                                disabled={!!uploadingField}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle">
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Global Maintenance Mode</h4>
                              <p>Pauses public landing page access and displays a lock/under construction screen.</p>
                            </div>
                            <button 
                              onClick={() => setGenMaintenanceMode(!genMaintenanceMode)}
                              className={`toggle-btn ${genMaintenanceMode ? 'active' : ''}`}
                            >
                              {genMaintenanceMode ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSaveSettings('general', { 
                            siteName: genSiteName, 
                            siteTitle: genSiteTitle, 
                            metaDescription: genMetaDesc, 
                            maintenanceMode: genMaintenanceMode,
                            whitepaperV1: genWhitepaperV1,
                            whitepaperV2: genWhitepaperV2
                          })}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'general'}
                        >
                          {saveLoading === 'general' ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'general' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save General Configuration</span></>
                          )}
                        </button>
                      </div>

                      {/* Diagnostics Panel */}
                      <div className="cms-live-preview">
                        <span className="preview-header">SEO DIAGNOSTICS &amp; META</span>
                        <div className="preview-card-frame border-light">
                          <div className="seo-google-snippet">
                            <span className="seo-link">https://gloopo.io</span>
                            <h4 className="seo-headline">{genSiteTitle || 'Gloopo - Community Assets'}</h4>
                            <p className="seo-description">{genMetaDesc || 'No SEO description set. Google will auto-generate text.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* G. NAVBAR BUTTONS FORM */}
                {settingsSubTab === 'buttons' && (
                  <div className="cms-tab-view fade-in">
                    <div className="cms-grid-layout">
                      <div className="cms-form-fields max-w-full">
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navbar Action Buttons</h4>
                        
                        <div className="cms-group border-card-toggle disabled-dev-mode" style={{ marginBottom: '1rem', opacity: 0.6, cursor: 'not-allowed', position: 'relative' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4>Show Connect Wallet Button</h4>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,187,0,0.1)', border: '1px solid rgba(255,187,0,0.3)', color: '#ffbb00', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Development Mode</span>
                              </div>
                              <p>Toggle visibility of the "Connect" wallet button and connection pill on the main navbar.</p>
                            </div>
                            <button 
                              disabled
                              className={`toggle-btn ${showConnectButton ? 'active' : ''}`}
                              style={{ cursor: 'not-allowed', pointerEvents: 'none' }}
                            >
                              {showConnectButton ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="divider-h" style={{ margin: '2rem 0' }}></div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navbar Menu Links</h4>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show Lore Link</h4>
                              <p>Toggle visibility of the "Lore" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowLoreMenu(!showLoreMenu)}
                              className={`toggle-btn ${showLoreMenu ? 'active' : ''}`}
                            >
                              {showLoreMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show Tech Link</h4>
                              <p>Toggle visibility of the "Tech" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowTechMenu(!showTechMenu)}
                              className={`toggle-btn ${showTechMenu ? 'active' : ''}`}
                            >
                              {showTechMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show Tokenomics Link</h4>
                              <p>Toggle visibility of the "Tokenomics" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowTokenomicsMenu(!showTokenomicsMenu)}
                              className={`toggle-btn ${showTokenomicsMenu ? 'active' : ''}`}
                            >
                              {showTokenomicsMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle disabled-dev-mode" style={{ marginBottom: '1rem', opacity: 0.6, cursor: 'not-allowed', position: 'relative' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4>Show Swap Link</h4>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,187,0,0.1)', border: '1px solid rgba(255,187,0,0.3)', color: '#ffbb00', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Development Mode</span>
                              </div>
                              <p>Toggle visibility of the "Swap" link in the navbar.</p>
                            </div>
                            <button 
                              disabled
                              className={`toggle-btn ${showSwapMenu ? 'active' : ''}`}
                              style={{ cursor: 'not-allowed', pointerEvents: 'none' }}
                            >
                              {showSwapMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show Roadmap Link</h4>
                              <p>Toggle visibility of the "Roadmap" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowRoadmapMenu(!showRoadmapMenu)}
                              className={`toggle-btn ${showRoadmapMenu ? 'active' : ''}`}
                            >
                              {showRoadmapMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show NFTs Link</h4>
                              <p>Toggle visibility of the "NFTs" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowShowcaseMenu(!showShowcaseMenu)}
                              className={`toggle-btn ${showShowcaseMenu ? 'active' : ''}`}
                            >
                              {showShowcaseMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="cms-group border-card-toggle" style={{ marginBottom: '1.5rem' }}>
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>Show Brand Kit Link</h4>
                              <p>Toggle visibility of the "Brand Kit" link in the navbar.</p>
                            </div>
                            <button 
                              onClick={() => setShowBrandKitMenu(!showBrandKitMenu)}
                              className={`toggle-btn ${showBrandKitMenu ? 'active' : ''}`}
                            >
                              {showBrandKitMenu ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSaveSettings('buttons', { 
                            showConnectButton,
                            showLore: showLoreMenu,
                            showTech: showTechMenu,
                            showTokenomics: showTokenomicsMenu,
                            showSwap: showSwapMenu,
                            showRoadmap: showRoadmapMenu,
                            showShowcase: showShowcaseMenu,
                            showBrandKit: showBrandKitMenu
                          })}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'buttons'}
                        >
                          {saveLoading === 'buttons' ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'buttons' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save Button Settings</span></>
                          )}
                        </button>
                      </div>

                      {/* Live preview */}
                      <div className="cms-live-preview">
                        <span className="preview-header">NAVBAR PREVIEW</span>
                        <div className="preview-card-frame" style={{ background: '#07120e', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13, 20, 18, 0.8)', padding: '0.75rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0,255,136,0.1)' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                              {showLoreMenu && <span>LORE</span>}
                              {showTechMenu && <span>TECH</span>}
                              {showTokenomicsMenu && <span>TOKENOMICS</span>}
                              {showSwapMenu && <span>SWAP</span>}
                              {showRoadmapMenu && <span>ROADMAP</span>}
                              {showShowcaseMenu && <span style={{ color: 'var(--primary)' }}>NFTS</span>}
                              {showBrandKitMenu && <span>BRAND KIT</span>}
                              {!showLoreMenu && !showTechMenu && !showTokenomicsMenu && !showSwapMenu && !showRoadmapMenu && !showShowcaseMenu && !showBrandKitMenu && (
                                <span style={{ color: '#ff4d4d', fontStyle: 'italic', fontSize: '0.65rem' }}>No Menu Links</span>
                              )}
                            </div>
                            <div>
                              {showConnectButton ? (
                                <button className="btn-primary-sm" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '50px', background: 'var(--primary)', color: '#030806', fontWeight: 800 }}>
                                  Connect
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.7rem', color: '#ff4d4d', fontStyle: 'italic' }}>Disabled / Hidden</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsSubTab === 'nfts' && (
                  <div className="cms-tab-content fade-in">
                    <div className="cms-grid-two-col">
                      <div className="cms-form-side">
                        <div className="cms-group border-card-toggle">
                          <div className="toggle-item-vertical">
                            <div>
                              <h4>NFTs Page Maintenance Mode</h4>
                              <p>Pauses public access to the NFTs (Showcase) page and displays an "Under Development" view.</p>
                            </div>
                            <button 
                              onClick={() => setNftsMaintenanceMode(!nftsMaintenanceMode)}
                              className={`toggle-btn ${nftsMaintenanceMode ? 'active' : ''}`}
                            >
                              {nftsMaintenanceMode ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                            </button>
                          </div>
                        </div>

                        <div className="divider-h" style={{ margin: '1.5rem 0' }}></div>
                        <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Crystara.trade Integration (Shared)</h4>

                        <div className="cms-group" style={{ marginBottom: '2rem' }}>
                          <label>API Network Environment</label>
                          <CustomDropdown
                            value={nftsCrystaraNetwork}
                            onChange={(val) => setNftsCrystaraNetwork(val as any)}
                            options={CRYSTARA_NETWORK_OPTIONS}
                          />
                        </div>

                        <div className="divider-h" style={{ margin: '1.5rem 0' }}></div>
                        <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Collections Setup</h4>

                        {/* OG Pass Collection Setup */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>OG PASS</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', color: nftsOgpassMaintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>
                                {nftsOgpassMaintenance ? 'Maintenance' : 'Live'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => setNftsOgpassMaintenance(!nftsOgpassMaintenance)}
                                className={`toggle-btn ${nftsOgpassMaintenance ? 'active' : ''}`}
                                style={{ padding: 0 }}
                              >
                                {nftsOgpassMaintenance ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: 0 }}>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Collection Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Gloopo OG Pass" 
                                value={nftsOgpassCollection} 
                                onChange={(e) => setNftsOgpassCollection(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Creator Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 0x9515..." 
                                value={nftsOgpassCreator} 
                                onChange={(e) => setNftsOgpassCreator(e.target.value)} 
                                className="flat-input font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Gen 01 Collection Setup */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Gen 01</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', color: nftsGen01Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>
                                {nftsGen01Maintenance ? 'Maintenance' : 'Live'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => setNftsGen01Maintenance(!nftsGen01Maintenance)}
                                className={`toggle-btn ${nftsGen01Maintenance ? 'active' : ''}`}
                                style={{ padding: 0 }}
                              >
                                {nftsGen01Maintenance ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: 0 }}>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Collection Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Gloopo" 
                                value={nftsGen01Collection} 
                                onChange={(e) => setNftsGen01Collection(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Creator Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 0xdd88..." 
                                value={nftsGen01Creator} 
                                onChange={(e) => setNftsGen01Creator(e.target.value)} 
                                className="flat-input font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Gen 02 Collection Setup */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Gen 02</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', color: nftsGen02Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>
                                {nftsGen02Maintenance ? 'Maintenance' : 'Live'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => setNftsGen02Maintenance(!nftsGen02Maintenance)}
                                className={`toggle-btn ${nftsGen02Maintenance ? 'active' : ''}`}
                                style={{ padding: 0 }}
                              >
                                {nftsGen02Maintenance ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: 0 }}>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Collection Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Gloopo Gen 2" 
                                value={nftsGen02Collection} 
                                onChange={(e) => setNftsGen02Collection(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Creator Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 0x..." 
                                value={nftsGen02Creator} 
                                onChange={(e) => setNftsGen02Creator(e.target.value)} 
                                className="flat-input font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Gen 03 Collection Setup */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Gen 03</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', color: nftsGen03Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>
                                {nftsGen03Maintenance ? 'Maintenance' : 'Live'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => setNftsGen03Maintenance(!nftsGen03Maintenance)}
                                className={`toggle-btn ${nftsGen03Maintenance ? 'active' : ''}`}
                                style={{ padding: 0 }}
                              >
                                {nftsGen03Maintenance ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: 0 }}>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Collection Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Gloopo Gen 3" 
                                value={nftsGen03Collection} 
                                onChange={(e) => setNftsGen03Collection(e.target.value)} 
                                className="flat-input"
                              />
                            </div>
                            <div className="cms-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.75rem' }}>Creator Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 0x..." 
                                value={nftsGen03Creator} 
                                onChange={(e) => setNftsGen03Creator(e.target.value)} 
                                className="flat-input font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={async () => {
                            // First save sensitive API key under its own secure key
                            await handleSaveSettings('crystara_api_key', {
                              apiKey: nftsCrystaraApiKey
                            });
                            // Then save non-sensitive settings under nfts
                            await handleSaveSettings('nfts', { 
                              maintenanceMode: nftsMaintenanceMode,
                              crystaraCreator: nftsCrystaraCreator,
                              crystaraCollection: nftsGen01Collection || nftsCrystaraCollection, // Fallback for safety
                              crystaraNetwork: nftsCrystaraNetwork,
                              ogpassCollection: nftsOgpassCollection,
                              ogpassMaintenance: nftsOgpassMaintenance,
                              ogpassCreator: nftsOgpassCreator,
                              gen01Collection: nftsGen01Collection,
                              gen01Maintenance: nftsGen01Maintenance,
                              gen01Creator: nftsGen01Creator,
                              gen02Collection: nftsGen02Collection,
                              gen02Maintenance: nftsGen02Maintenance,
                              gen02Creator: nftsGen02Creator,
                              gen03Collection: nftsGen03Collection,
                              gen03Maintenance: nftsGen03Maintenance,
                              gen03Creator: nftsGen03Creator
                            });
                          }}
                          className="flat-save-btn btn-primary"
                          disabled={saveLoading === 'nfts' || saveLoading === 'crystara_api_key'}
                        >
                          { (saveLoading === 'nfts' || saveLoading === 'crystara_api_key') ? (
                            <span className="spinner-white"></span>
                          ) : saveSuccess === 'nfts' ? (
                            <><Check size={16} /><span>Saved Successfully!</span></>
                          ) : (
                            <><Save size={16} /><span>Save NFTs Settings</span></>
                          )}
                        </button>
                      </div>

                      <div className="cms-live-preview">
                        <span className="preview-header">STATUS &amp; API PREVIEW</span>
                        <div className="preview-card-frame" style={{ background: '#07120e', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>NFTs PAGE VIEW STATUS</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: nftsMaintenanceMode ? '#ff4d4d' : '#00ff88' }}></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
                              {nftsMaintenanceMode ? 'Development Mode / Maintenanced' : 'Live / Publicly Accessible'}
                            </span>
                          </div>

                          <div className="divider-h" style={{ margin: '0.75rem 0' }}></div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>COLLECTIONS STATUS</span>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.35rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>OG Pass ({nftsOgpassCollection || 'Gloopo OG Pass'})</span>
                                <span style={{ color: nftsOgpassMaintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>{nftsOgpassMaintenance ? 'Coming Soon' : 'Live'}</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                Creator: {nftsOgpassCreator || '—'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.35rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Gen 01 ({nftsGen01Collection || nftsCrystaraCollection || 'Gloopo'})</span>
                                <span style={{ color: nftsGen01Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>{nftsGen01Maintenance ? 'Coming Soon' : 'Live'}</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                Creator: {nftsGen01Creator || nftsCrystaraCreator || '—'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.35rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Gen 02 ({nftsGen02Collection || '—'})</span>
                                <span style={{ color: nftsGen02Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>{nftsGen02Maintenance ? 'Coming Soon' : 'Live'}</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                Creator: {nftsGen02Creator || '—'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Gen 03 ({nftsGen03Collection || '—'})</span>
                                <span style={{ color: nftsGen03Maintenance ? '#ff4d4d' : '#00ff88', fontWeight: 'bold' }}>{nftsGen03Maintenance ? 'Coming Soon' : 'Live'}</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                Creator: {nftsGen03Creator || '—'}
                              </span>
                            </div>
                          </div>

                          <div className="divider-h" style={{ margin: '0.75rem 0' }}></div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>CRYSTARA API ENDPOINT (GEN 01 EXAMPLE)</span>
                          <div style={{ fontSize: '0.75rem', color: '#fff', wordBreak: 'break-all', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.1)' }}>
                            {nftsCrystaraCreator && (nftsGen01Collection || nftsCrystaraCollection) ? (
                              `https://api.crystara.trade/${nftsCrystaraNetwork}/tokens-by-collection?creator=${nftsCrystaraCreator.substring(0, 8)}...&collection=${nftsGen01Collection || nftsCrystaraCollection}`
                            ) : (
                              <span style={{ color: '#ffbb00', fontStyle: 'italic' }}>API endpoint not fully configured</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsSubTab === 'partners' && (
                  <div className="cms-tab-content fade-in" style={{ animationDelay: '0s' }}>
                    <div className="cms-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                      <div className="cms-form-fields">
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users size={18} style={{ color: 'var(--primary)' }} />
                          <span>Ecosystem Partners Logos ({partnersList.length} / 10)</span>
                        </h4>

                        {/* List of current dynamic assets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                          {loadingPartners ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                              <span className="spinner-white" style={{ display: 'inline-block', margin: '0 auto 1rem auto' }}></span>
                              <p>Loading partner logos...</p>
                            </div>
                          ) : partnersList.length === 0 ? (
                            <div style={{ 
                              padding: '2rem', 
                              textAlign: 'center', 
                              background: 'rgba(255,255,255,0.01)', 
                              border: '1px dashed rgba(255,255,255,0.05)', 
                              borderRadius: '12px',
                              color: 'var(--text-muted)',
                              fontSize: '0.85rem'
                            }}>
                              No partner logos added yet. Use the upload field below (max 10).
                            </div>
                          ) : (
                            partnersList.map((partner, idx) => (
                              <div key={idx} style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                borderRadius: '12px', 
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ 
                                    width: '64px', 
                                    height: '48px', 
                                    borderRadius: '8px', 
                                    background: '#020604', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                  }}>
                                    {partner.isMock && partner.path.startsWith('◇') ? (
                                      <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', padding: '0.2rem', textAlign: 'center' }}>
                                        {partner.path.substring(2)}
                                      </div>
                                    ) : (
                                      <img src={partner.path} alt={partner.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                    )}
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }} title={partner.name}>
                                        {partner.name.length > 25 ? partner.name.substring(0, 22) + '...' : partner.name}
                                      </span>
                                      <span style={{ 
                                        fontSize: '0.65rem', 
                                        fontWeight: 800, 
                                        color: 'var(--primary)', 
                                        background: 'rgba(0, 255, 136, 0.08)',
                                        padding: '0.15rem 0.4rem',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(0, 255, 136, 0.15)'
                                      }}>{partner.size}</span>
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDeletePartner(partner.name, idx)}
                                  style={{ 
                                    background: 'rgba(255, 64, 64, 0.08)', 
                                    border: '1px solid rgba(255, 64, 64, 0.2)', 
                                    color: '#ff4444', 
                                    padding: '0.5rem', 
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    outline: 'none'
                                  }}
                                  title="Delete Partner Logo"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Upload Sub-form */}
                        {partnersList.length < 10 ? (
                          <div style={{ 
                            background: 'rgba(255,255,255,0.01)', 
                            border: '1px solid rgba(255,255,255,0.04)', 
                            borderRadius: '16px', 
                            padding: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                              Upload New Partner Logo
                            </h5>

                            <div className="cms-group" style={{ marginBottom: 0 }}>
                              <label>Select Logo Image (PNG, JPG, GIF, SVG * max 5MB)</label>
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <label className="flat-upload-label" style={{ 
                                  background: uploadingField === 'partnerLogo' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 136, 0.08)',
                                  border: '1px dashed rgba(0, 255, 136, 0.3)',
                                  color: 'var(--primary)',
                                  padding: '1rem 2rem',
                                  borderRadius: '8px',
                                  cursor: uploadingField ? 'not-allowed' : 'pointer',
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  whiteSpace: 'nowrap',
                                  width: '100%',
                                  textAlign: 'center'
                                }}>
                                  <Upload size={18} />
                                  {uploadingField === 'partnerLogo' ? 'Uploading Logo...' : 'Choose Logo File & Upload'}
                                  <input 
                                    type="file" 
                                    onChange={handlePartnerUpload} 
                                    accept="image/*" 
                                    style={{ display: 'none' }}
                                    disabled={!!uploadingField}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            background: 'rgba(255,187,0,0.05)', 
                            border: '1px solid rgba(255,187,0,0.2)', 
                            color: '#ffbb00', 
                            fontSize: '0.82rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '2rem'
                          }}>
                            ⚠️ Maximum of 10 partners reached. Please delete an existing logo to upload a new one.
                          </div>
                        )}
                      </div>

                      {/* Partners CMS Info Widget */}
                      <div className="cms-live-preview">
                        <span className="preview-header">PARTNERS INFO HUB</span>
                        <div className="preview-card-frame border-light" style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>Partners Storage Details</h5>
                          <p className="p-paragraph font-sm line-loose" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Partner logos uploaded here are saved directly to the public <code>partners</code> storage bucket on Supabase.
                          </p>
                          <ul style={{ paddingLeft: '1.25rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.4' }}>
                            <li>Upload logos with transparent backgrounds (PNG or SVG format) for optimal display on the dark homepage.</li>
                            <li>The homepage displays a maximum of 10 partner logos in a sleek grid section.</li>
                            <li>In mock mode (without Supabase configuration), logos are simulated using high-fidelity local text-badges and stored in your browser's local storage.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}



              </div>

            </div>
          </div>
        )}



        {/* 6. PROFILE SETTINGS PANEL */}
        {currentTab === 'profile' && (
          <div className="tab-content fade-in">
            <div className="glass-card single-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <User size={20} className="panel-icon" style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Profile Settings</h3>
              </div>
              <p className="panel-desc" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Manage your administrator profile and configure two-factor authentication (MFA) security.
              </p>

              <div className="divider-h" style={{ margin: '1.5rem 0' }}></div>

              {/* Profile Details Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Account Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email Address</label>
                    <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{adminEmail}</span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Access Role</label>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 700, display: 'inline-block' }}>ADMINISTRATOR</span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Account Status</label>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(187, 255, 0, 0.1)', color: '#bbff00', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 700, display: 'inline-block' }}>ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="divider-h" style={{ margin: '1.5rem 0' }}></div>

              {/* MFA Settings Section */}
              <div className="cms-section-form">
                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} />
                  <span>Google Authenticator Multi-Factor Authentication (MFA)</span>
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Two-factor authentication (MFA) security adds an extra layer of protection to your account. Once enabled, you will be prompted to enter a 6-digit verification code from Google Authenticator every time you log in to the admin panel.
                </p>

                {!isSupabaseConfigured ? (
                  <div className="alert-box error" style={{ background: 'rgba(255, 77, 77, 0.05)', border: '1px solid rgba(255, 77, 77, 0.15)', color: '#ff4d4d', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    Multi-Factor Authentication requires an active connection to the Supabase database. MFA features are disabled in mock database mode.
                  </div>
                ) : loadingMfa ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span className="spinner-white" style={{ width: '16px', height: '16px' }}></span>
                    <span>Checking MFA status...</span>
                  </div>
                ) : mfaActive ? (
                  mfaStep === 'disable' ? (
                    <div style={{ background: 'rgba(255, 77, 77, 0.02)', border: '1px solid rgba(255, 77, 77, 0.15)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ff4d4d', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Shield size={20} />
                        <span>Confirm Disabling MFA</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                        Please enter the 6-digit verification code from your authenticator app to confirm you want to disable Multi-Factor Authentication.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '280px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6-Digit Code</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 123456"
                            value={mfaVerifyCode}
                            onChange={(e) => setMfaVerifyCode(e.target.value.replace(/\D/g, ''))}
                            className="flat-input font-mono"
                            style={{ width: '120px', letterSpacing: '0.2em', textAlign: 'center' }}
                          />
                          <button
                            onClick={handleVerifyDisableMfa}
                            className="flat-save-btn"
                            disabled={mfaVerifyCode.length !== 6}
                            style={{ flex: 1, padding: '0.5rem 1rem', background: '#ff4d4d', color: '#fff', border: '1px solid rgba(255, 77, 77, 0.2)' }}
                          >
                            Disable MFA
                          </button>
                        </div>
                      </div>

                      <div className="divider-h" style={{ margin: '0.5rem 0' }}></div>
                      <button
                        onClick={() => setMfaStep('none')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', alignSelf: 'flex-start', padding: 0 }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(0, 255, 136, 0.02)', border: '1px solid rgba(0, 255, 136, 0.15)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00ff88', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Shield size={20} />
                        <span>Google Authenticator MFA is ACTIVE</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                        Your account is protected by two-factor authentication. Click the button below if you wish to disable it (Warning: this will lower your account security).
                      </p>
                      <button
                        onClick={handleDisableMfa}
                        className="flat-save-btn"
                        style={{ background: 'rgba(255, 77, 77, 0.12)', border: '1px solid rgba(255, 77, 77, 0.35)', color: '#ff4d4d', alignSelf: 'flex-start', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        Disable MFA
                      </button>
                    </div>
                  )
                ) : mfaStep === 'enroll' ? (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h5 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>1. Scan QR Code</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Scan this QR code using Google Authenticator, Authy, or another TOTP authenticator app.
                      </p>
                      {mfaQrCode ? (
                        <div style={{ background: '#fff', padding: '1rem', display: 'inline-block', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                          <img src={mfaQrCode} alt="MFA QR Code" style={{ width: '160px', height: '160px', display: 'block' }} />
                        </div>
                      ) : (
                        <span className="spinner-white" style={{ marginTop: '1rem' }}></span>
                      )}
                    </div>

                    <div>
                      <h5 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>2. Enter Secret Key (Alternative)</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        If you cannot scan the QR code, enter this secret key manually in your authenticator app:
                      </p>
                      <code style={{ display: 'inline-block', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'monospace', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
                        {mfaSecret}
                      </code>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '280px' }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>3. Verify Security Code</h5>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6-Digit Code</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 123456"
                          value={mfaVerifyCode}
                          onChange={(e) => setMfaVerifyCode(e.target.value.replace(/\D/g, ''))}
                          className="flat-input font-mono"
                          style={{ width: '120px', letterSpacing: '0.2em', textAlign: 'center' }}
                        />
                        <button
                          onClick={handleVerifyMfa}
                          className="flat-save-btn btn-primary"
                          disabled={mfaVerifyCode.length !== 6}
                          style={{ flex: 1, padding: '0.5rem 1rem' }}
                        >
                          Verify &amp; Enable
                        </button>
                      </div>
                    </div>

                    <div className="divider-h" style={{ margin: '0.5rem 0' }}></div>
                    <button
                      onClick={() => setMfaStep('none')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', alignSelf: 'flex-start', padding: 0 }}
                    >
                      Cancel Setup
                    </button>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
                      <Lock size={20} />
                      <span>Google Authenticator MFA is DISABLED</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                      Enabling MFA prevents unauthorized access to your admin panel by requiring a security token from your authenticator app in addition to your email and password.
                    </p>
                    <button
                      onClick={handleEnableMfa}
                      className="flat-save-btn btn-primary"
                      style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Enable Google MFA
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. ADMIN ACTIVITY LOGS PANEL */}
        {currentTab === 'logs' && (
          <div className="tab-content fade-in">
            <div className="glass-card single-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <Activity size={20} className="panel-icon" style={{ color: 'var(--primary)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Admin Activity Logs</h3>
                  </div>
                  <p className="panel-desc" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Real-time auditing of control panel configuration actions.
                  </p>
                </div>
                {logs.length > 0 && (
                  <button 
                    onClick={handleClearLogs} 
                    className="flat-action-btn delete-btn"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      background: 'rgba(255, 77, 77, 0.15)', 
                      border: '1px solid rgba(255, 77, 77, 0.3)', 
                      color: '#ff4d4d', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      transition: 'all 0.3s ease' 
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Clear All Logs</span>
                  </button>
                )}
              </div>

              <div className="divider-h" style={{ margin: '0 0 1.5rem 0' }}></div>

              {loadingLogs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                  <span className="spinner"></span>
                </div>
              ) : logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <Activity size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>No Logs Recorded Yet</h4>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Actions performed by administrators in the control panel will appear here in real-time.
                  </p>
                </div>
              ) : (
                (() => {
                  const totalPages = Math.ceil(logs.length / LOGS_PER_PAGE);
                  const safePage = Math.min(logsPage, totalPages);
                  const startIdx = (safePage - 1) * LOGS_PER_PAGE;
                  const pageLogs = logs.slice(startIdx, startIdx + LOGS_PER_PAGE);

                  return (
                    <div>
                      {/* Table */}
                      <div className="whitelist-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="admin-table whitelist-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
                              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                              <th style={{ padding: '0.75rem 1rem' }}>Administrator</th>
                              <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                              <th style={{ padding: '0.75rem 1rem' }}>Details</th>
                              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageLogs.map((log) => {
                              let actionColor = 'rgba(0, 255, 136, 0.1)';
                              let actionTextColor = '#00ff88';
                              if (log.action.includes('delete')) {
                                actionColor = 'rgba(255, 77, 77, 0.1)';
                                actionTextColor = '#ff4d4d';
                              } else if (log.action.includes('add') || log.action.includes('upload')) {
                                actionColor = 'rgba(187, 255, 0, 0.1)';
                                actionTextColor = '#bbff00';
                              }

                              return (
                                <tr key={log.id} style={{ transition: 'background 0.2s ease' }} className="log-row">
                                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                                    {new Date(log.created_at || log.timestamp).toLocaleString('en-US', {
                                      hour12: false,
                                      month: 'short',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </td>
                                  <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>
                                    {log.admin_email}
                                  </td>
                                  <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                      background: actionColor, 
                                      color: actionTextColor, 
                                      border: `1px solid ${actionTextColor}25`,
                                      padding: '0.25rem 0.6rem', 
                                      borderRadius: '6px', 
                                      fontSize: '0.7rem', 
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em'
                                    }}>
                                      {log.action}
                                    </span>
                                  </td>
                                  <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                    {log.details}
                                  </td>
                                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button 
                                      onClick={() => handleDeleteSingleLog(log.id)}
                                      className="log-delete-btn"
                                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s ease', padding: '0.25rem' }}
                                      title="Delete log entry"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '1.25rem',
                          padding: '0.75rem 1rem',
                          background: 'rgba(0,0,0,0.25)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '10px'
                        }}>
                          {/* Left: log count info */}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Showing {startIdx + 1}–{Math.min(startIdx + LOGS_PER_PAGE, logs.length)} of {logs.length} entries
                          </span>

                          {/* Center: chevron navigation */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                              disabled={safePage === 1}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: safePage === 1 ? 'transparent' : 'rgba(0,255,136,0.06)',
                                color: safePage === 1 ? 'rgba(255,255,255,0.2)' : 'var(--primary)',
                                cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <ChevronLeft size={16} />
                            </button>

                            <span style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#fff',
                              background: 'rgba(0,255,136,0.08)',
                              border: '1px solid rgba(0,255,136,0.2)',
                              borderRadius: '8px',
                              padding: '0.3rem 0.85rem',
                              minWidth: '60px',
                              textAlign: 'center',
                              fontFamily: 'monospace',
                              letterSpacing: '0.05em'
                            }}>
                              {safePage}/{totalPages}
                            </span>

                            <button
                              onClick={() => setLogsPage(p => Math.min(totalPages, p + 1))}
                              disabled={safePage === totalPages}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: safePage === totalPages ? 'transparent' : 'rgba(0,255,136,0.06)',
                                color: safePage === totalPages ? 'rgba(255,255,255,0.2)' : 'var(--primary)',
                                cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>

                          {/* Right: jump-to-page dots */}
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                              <button
                                key={pg}
                                onClick={() => setLogsPage(pg)}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  background: pg === safePage
                                    ? 'var(--primary)'
                                    : 'rgba(255,255,255,0.15)',
                                  transform: pg === safePage ? 'scale(1.4)' : 'scale(1)'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}



      </main>

      <style jsx>{`
        .admin-layout {
          height: 100vh;
          width: 100vw;
          background: #030806;
          display: flex;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .bg-decorations {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
          pointer-events: none;
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(160px);
          opacity: 0.06;
        }

        .glow-sphere.main {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -150px;
          left: 20%;
        }

        .glow-sphere.secondary {
          width: 450px;
          height: 450px;
          background: var(--accent);
          bottom: -150px;
          right: 10%;
        }

        /* SIDEBAR PANEL */
        .admin-sidebar {
          width: 280px;
          background: rgba(4, 12, 10, 0.95);
          border-right: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: relative;
          height: 100%;
          z-index: 10;
          flex-shrink: 0;
          overflow: hidden; /* Lock sidebar scrolling */
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .logo-shield {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.1);
        }

        .platform-tag {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--primary);
          display: block;
        }

        .sidebar-brand h2 {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .connection-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.live {
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary);
        }

        .status-dot.mock {
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.9rem 1.1rem;
          border-radius: 10px;
          background: transparent;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: var(--primary);
          transform: scaleY(0);
          transition: transform 0.2s ease;
          transform-origin: bottom;
        }

        .nav-item.active::before {
          transform: scaleY(1);
          transform-origin: top;
        }

        .nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }

        .nav-item.active {
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.12);
          color: var(--primary);
        }

        .nav-item .chevron {
          margin-left: auto;
          opacity: 0;
          transform: translateX(-5px);
          transition: all 0.2s ease;
        }

        .nav-item.active .chevron {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar-placeholder {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--primary);
        }

        .admin-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-role {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-email {
          font-size: 0.78rem;
          color: #fff;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 170px;
        }

        .logout-btn {
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.2);
          color: #ff4d4d;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 77, 77, 0.15);
          border-color: #ff4d4d;
          transform: translateY(-1px);
        }

        /* MAIN CONTENT AREA */
        .admin-main {
          flex: 1;
          padding: 2rem 2.5rem;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: calc(100vw - 280px);
          height: 100%;
          overflow-y: auto;
        }

        /* Top Mini Header */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 2rem;
          border-radius: var(--radius-lg);
          background: rgba(4, 12, 10, 0.6);
        }

        .main-header:hover {
          transform: none;
          box-shadow: none;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .muted-crumb {
          color: var(--text-muted);
        }

        .divider {
          color: rgba(255,255,255,0.15);
        }

        .active-crumb {
          color: var(--primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .time-display {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .header-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .header-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Mock Mode banner */
        .mock-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: rgba(187, 255, 0, 0.02);
          border: 1px solid rgba(187, 255, 0, 0.15);
          border-radius: var(--radius-lg);
        }

        .mock-banner:hover {
          transform: none;
          box-shadow: none;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .alert-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background: rgba(187, 255, 0, 0.05);
          border: 1px solid rgba(187, 255, 0, 0.2);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .banner-left h3 {
          font-size: 0.95rem;
          color: var(--accent);
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .banner-left p {
          color: var(--text-muted);
          font-size: 0.8rem;
          line-height: 1.4;
          max-width: 750px;
        }

        .btn-primary-sm-white {
          background: #fff;
          color: #030806;
          padding: 0.55rem 1.1rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.78rem;
          display: inline-block;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary-sm-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.15);
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .metric-box {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.4rem 1.6rem;
          background: rgba(4, 12, 10, 0.5);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .metric-box.blue-theme { border-color: rgba(59, 130, 246, 0.18); }
        .metric-box.green-theme { border-color: rgba(0, 255, 136, 0.18); }
        .metric-box.purple-theme { border-color: rgba(168, 85, 247, 0.18); }
        .metric-box.neon-theme { border-color: rgba(187, 255, 0, 0.18); }

        .metric-box.blue-theme:hover {
          transform: translateY(-3px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
        }

        .metric-box.green-theme:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 12px 30px rgba(0, 255, 136, 0.15);
        }

        .metric-box.purple-theme:hover {
          transform: translateY(-3px);
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.15);
        }

        .metric-box.neon-theme:hover {
          transform: translateY(-3px);
          border-color: rgba(187, 255, 0, 0.5);
          box-shadow: 0 12px 30px rgba(187, 255, 0, 0.15);
        }

        .metric-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-icon.blue { background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .metric-icon.green { background: rgba(0, 255, 136, 0.08); border: 1px solid rgba(0, 255, 136, 0.2); color: var(--primary); }
        .metric-icon.purple { background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.2); color: #a855f7; }
        .metric-icon.neon { background: rgba(187, 255, 0, 0.08); border: 1px solid rgba(187, 255, 0, 0.2); color: var(--accent); }

        .metric-info .label {
          color: var(--text-muted);
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 0.2rem;
        }

        .metric-info h2 {
          font-size: 1.45rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .metric-info .change {
          font-size: 0.7rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.2rem;
        }

        .metric-info .change.positive {
          color: var(--primary);
        }

        /* Bento grid for Overview */
        .dashboard-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .bento-panel {
          padding: 2rem;
          background: rgba(4, 12, 10, 0.6);
        }

        .bento-panel:hover {
          transform: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          border-color: var(--glass-border);
        }

        .traffic-panel-quick { grid-column: span 12; }

        .traffic-analytics-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .traffic-analytics-content {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .panel-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .badge-alert-pill {
          background: rgba(187, 255, 0, 0.05);
          border: 1px solid rgba(187, 255, 0, 0.2);
          color: var(--accent);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          letter-spacing: 0.05em;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .panel-icon {
          color: var(--primary);
        }

        .panel-header h3 {
          font-size: 1.15rem;
          color: #fff;
          font-weight: 700;
        }

        .panel-desc {
          color: var(--text-muted);
          font-size: 0.82rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .toggle-list.small {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: rgba(0,0,0,0.25);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.01);
        }

        .toggle-info h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }

        .toggle-btn {
          background: none;
          color: rgba(255,255,255,0.12);
          transition: all 0.2s ease;
          display: flex;
        }

        .toggle-btn.active { color: var(--primary); }
        .toggle-btn.warning.active { color: #ff9f43; }

        .btn-text-link {
          background: transparent;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0;
          transition: all 0.2s;
        }

        .btn-text-link:hover {
          color: var(--primary-bright);
          transform: translateX(3px);
        }

        /* Live Feed Badge */
        .live-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.15);
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--primary);
          margin-left: auto;
        }

        .live-pill .dot {
          width: 5px;
          height: 5px;
          background: var(--primary);
          border-radius: 50%;
        }

        /* Single panels for active tabs */
        .single-panel {
          padding: 2.5rem 2.25rem;
          background: rgba(4, 12, 10, 0.6);
        }

        .single-panel:hover {
          transform: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border-color: var(--glass-border);
        }

        /* --- CMS CONTENT STYLING --- */
        .cms-sub-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .cms-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.6rem 1.1rem;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cms-tab-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .cms-tab-btn.active {
          background: var(--primary);
          color: #030806;
          border-color: var(--primary);
          box-shadow: 0 3px 15px rgba(0, 255, 136, 0.15);
        }

        .cms-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .cms-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .cms-form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 650px;
        }

        .cms-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cms-group label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .large-area {
          min-height: 140px;
          resize: vertical;
          line-height: 1.6;
        }

        .medium-area {
          min-height: 90px;
          resize: vertical;
          line-height: 1.6;
        }

        .code-area {
          min-height: 80px;
          font-family: monospace;
          font-size: 0.8rem;
          background: #000 !important;
          color: #00FF88 !important;
        }

        .flat-save-btn {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.85rem;
          margin-top: 1rem;
          border: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flat-save-btn:not(:disabled):hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 136, 0.2);
        }

        .flat-save-btn:not(:disabled):active {
          transform: scale(0.98) translateY(0);
        }

        .flat-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-white {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: loading-spin 0.8s linear infinite;
        }

        /* Real-time Preview Widget card */
        .cms-live-preview {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .preview-header {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          display: block;
        }

        .preview-card-frame {
          background: rgba(4, 12, 10, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .preview-card-frame.border-light {
          border-color: rgba(255, 255, 255, 0.05);
        }

        .p-tagline {
          color: var(--primary);
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.75rem;
        }

        .p-headline {
          font-size: 1.45rem;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .p-subheadline {
          font-size: 0.82rem;
          color: var(--primary);
          opacity: 0.85;
          font-weight: 600;
          display: block;
          margin-bottom: 1rem;
        }

        .p-paragraph {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .font-sm { font-size: 0.8rem; }
        .line-loose { line-height: 1.6; }

        /* Tokenomics preview list items */
        .form-horizontal-row {
          display: flex;
          gap: 1rem;
        }

        .flex-1 { flex: 1; }

        .preview-stat-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .preview-stat-row.bottom-pad {
          margin-bottom: 1.5rem;
        }

        .p-muted {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 0.15rem;
        }

        .p-bold {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
        }

        .p-bold.var-green {
          color: var(--primary);
        }

        .p-muted-header {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.75rem;
        }

        .distribution-ledger-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .ledger-item {
          display: flex;
          align-items: center;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .ledger-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .ledger-label { color: #fff; opacity: 0.85; }
        .ledger-pct { margin-left: auto; color: var(--primary); }

        .chart-slices-builder {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(0,0,0,0.2);
          padding: 1rem;
          border-radius: var(--radius-md);
        }

        .slice-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .slice-color-indicator {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .slice-name {
          flex: 1;
          padding: 0.5rem 0.75rem !m;
        }

        .slice-pct {
          width: 70px;
          text-align: center;
        }

        .pct-unit {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        /* Brand kit details color indicators */
        .color-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-dot-picker {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: none;
          border: 1px solid var(--glass-border);
          cursor: pointer;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .palette-card {
          text-align: center;
        }

        .palette-card .color-swatch {
          height: 50px;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          margin-bottom: 0.35rem;
        }

        .palette-card span {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 700;
          display: block;
        }

        .logo-preview-box {
          border-top: 1px solid rgba(255,255,255,0.03);
          padding-top: 1rem;
          text-align: center;
        }

        .block { display: block; }
        .margin-bot { margin-bottom: 0.5rem; }

        /* Roadmap Phase List items */
        .roadmap-cms-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .roadmap-form-box {
          max-width: 900px;
          width: 100%;
        }

        .min-w-120 { min-width: 120px; }
        .min-w-160 { min-width: 160px; }
        .flex-2 { flex: 2; }
        .height-flat { height: 42px; }
        .spacing-top { margin-top: 0.75rem; }

        .bullets-manager-box {
          margin-top: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bullets-manager-box label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .bullet-adder-row {
          display: flex;
          gap: 0.5rem;
        }

        .bullets-staged-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(0,0,0,0.3);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-top: 0.25rem;
        }

        .staged-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.01);
          padding-bottom: 0.35rem;
        }

        .staged-item:last-child {
          border: none;
          padding: 0;
        }

        .staged-del {
          background: none;
          color: #ff4d4d;
          opacity: 0.7;
          transition: opacity 0.2s;
          display: flex;
        }

        .staged-del:hover {
          opacity: 1;
        }

        .roadmap-phases-cms-list h4 {
          font-size: 1.05rem;
          color: #fff;
          margin-bottom: 1.25rem;
        }

        .roadmap-timeline-vertical {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .roadmap-node-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: border-color 0.2s;
        }

        .roadmap-node-card:hover {
          border-color: rgba(255,255,255,0.08);
        }

        .roadmap-node-card.completed { border-left: 3px solid var(--primary); }
        .roadmap-node-card.active { border-left: 3px solid #ff9f43; }
        .roadmap-node-card.pending { border-left: 3px solid var(--text-muted); }

        .node-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .node-phase {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
        }

        .node-status {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .node-status.completed { background: rgba(0, 255, 136, 0.08); color: var(--primary); }
        .node-status.active { background: rgba(255, 159, 67, 0.08); color: #ff9f43; }
        .node-status.pending { background: rgba(255,255,255,0.04); color: var(--text-muted); }

        .node-delete-btn {
          margin-left: auto;
          background: none;
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .node-delete-btn:hover {
          color: #ff4d4d;
        }

        .node-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .node-items-list {
          padding-left: 1.2rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* SEO Snippet previews */
        .seo-google-snippet {
          background: #fff;
          color: #1a0dab;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #dadce0;
        }

        .seo-link {
          font-size: 0.75rem;
          color: #202124;
          display: block;
          margin-bottom: 0.15rem;
        }

        .seo-headline {
          font-size: 1.15rem;
          font-weight: 500;
          color: #1a0dab;
          margin-bottom: 0.25rem;
          line-height: 1.3;
          font-family: Arial, sans-serif;
        }

        .seo-description {
          font-size: 0.8rem;
          color: #4d5156;
          line-height: 1.4;
          font-family: Arial, sans-serif;
        }

        .border-card-toggle {
          background: rgba(255, 159, 67, 0.02);
          border: 1px solid rgba(255, 159, 67, 0.15);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
        }

        .toggle-item-vertical {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .toggle-item-vertical h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.2rem;
        }

        .toggle-item-vertical p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Smart Contracts Tab Details */
        .contract-controls-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .contract-controls-grid {
            grid-template-columns: 1fr;
          }
        }

        .control-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }

        .control-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .control-card p {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          min-height: 48px;
        }

        .control-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .state-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .state-label.active { color: var(--primary); }
        .state-label.paused { color: #ff4d4d; }

        .btn-control-toggle {
          padding: 0.55rem 1.1rem;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .btn-control-toggle.pause {
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.2);
          color: #ff4d4d;
        }

        .btn-control-toggle.pause:hover {
          background: rgba(255, 77, 77, 0.15);
          border-color: #ff4d4d;
        }

        .btn-control-toggle.resume {
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: var(--primary);
        }

        .btn-control-toggle.resume:hover {
          background: rgba(0, 255, 136, 0.15);
          border-color: var(--primary);
        }

        .divider-h {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 2.25rem 0;
        }

        .divider-h.small {
          margin: 1.25rem 0;
        }

        .parameters-form h4 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 1.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .field-desc {
          color: var(--text-muted);
          font-size: 0.78rem;
          margin-bottom: 0.75rem;
        }

        .form-group-flat label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.25rem;
        }

        .flat-input-row {
          display: flex;
          gap: 0.35rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.35rem;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
        }

        .flat-tab-btn {
          flex: 1;
          padding: 0.55rem;
          border-radius: 50px;
          background: transparent;
          color: var(--text-muted);
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .flat-tab-btn.active {
          background: var(--primary);
          color: #030806;
          box-shadow: 0 3px 10px rgba(0, 255, 136, 0.2);
        }

        .input-with-suffix {
          display: flex;
          align-items: center;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .input-with-suffix .flat-input {
          border: none;
          flex: 1;
        }

        .input-with-suffix .suffix {
          padding: 0 1rem;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          background: rgba(255,255,255,0.01);
          border-left: 1px solid var(--glass-border);
          height: 100%;
          display: flex;
          align-items: center;
        }

        /* Whitelist Manager Tab Details */
        .whitelist-form-box {
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.01);
          border-radius: var(--radius-lg);
          padding: 1.5rem 1.75rem;
        }

        .whitelist-form-box h4 {
          font-size: 1rem;
          color: #fff;
          margin-bottom: 1.25rem;
        }

        .flat-form-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .input-field-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 200px;
        }

        .input-field-col label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .flat-input, .flat-select {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.8rem 1.1rem;
          color: #fff;
          font-size: 0.85rem;
          font-family: inherit;
          font-weight: 600;
          outline: none;
          width: 100%;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flat-input:focus, .flat-select:focus {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
          background: rgba(0, 0, 0, 0.5);
        }

        .flat-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300ff88' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1.1rem center;
          background-size: 1rem;
          padding-right: 2.8rem;
          cursor: pointer;
        }

        .flat-select option {
          background: #040c0a;
          color: #fff;
        }

        .flat-add-btn {
          background: var(--primary);
          color: #030806;
          border-radius: var(--radius-md);
          padding: 0.8rem 1.5rem;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          border: none;
          height: 43px;
        }

        .flat-add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
          background: var(--primary-bright);
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .section-header-row h4 {
          font-size: 1.1rem;
          color: #fff;
        }

        .subtitle-count {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Database Hub Details */
        .supabase-status-widget {
          background: rgba(0, 255, 136, 0.02);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.75rem;
          margin-bottom: 2rem;
        }

        .status-grid-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .status-item-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.01);
          padding-bottom: 0.5rem;
        }

        .status-item-line:last-child {
          border: none;
          padding: 0;
        }

        .status-item-line .meta-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-item-line .meta-value {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
        }

        .integration-steps {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }

        .step-item {
          display: flex;
          gap: 1.25rem;
        }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--primary);
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.1);
        }

        .step-item h4 {
          font-size: 0.95rem;
          color: #fff;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .step-item p {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .warning-text {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 700;
          display: block;
          margin-top: 0.5rem;
        }

        .code-block {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-family: monospace;
          font-size: 0.75rem;
          color: #e5e7eb;
          line-height: 1.5;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .migration-files-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .migration-file-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          transition: border-color 0.2s;
        }

        .migration-file-card:hover {
          border-color: var(--primary);
        }

        .file-meta {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }

        .file-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #fff;
        }

        .file-path {
          font-size: 0.7rem;
          font-family: monospace;
          color: var(--primary);
        }

        .migration-file-card p {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin: 0;
        }

        /* TABLES UTILITIES */
        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .admin-table td {
          padding: 1rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255,255,255,0.015);
        }

        .admin-table tbody tr {
          transition: all 0.2s ease;
        }

        .admin-table tbody tr:hover {
          background: rgba(0, 255, 136, 0.015);
        }

        .admin-table tbody tr:hover td {
          color: #fff;
          border-bottom-color: rgba(0, 255, 136, 0.08);
        }

        .wallet-addr {
          font-family: monospace;
          color: var(--primary) !important;
          letter-spacing: 0.01em;
        }

        .full-width-addr {
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .type-badge {
          color: #fff;
          opacity: 0.8;
          font-weight: 700;
        }

        .text-muted-col {
          color: var(--text-muted) !important;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.5rem;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-badge.completed {
          background: rgba(0, 255, 136, 0.04);
          border: 1px solid rgba(0, 255, 136, 0.15);
          color: var(--primary);
        }

        .status-badge.failed {
          background: rgba(255, 77, 77, 0.04);
          border: 1px solid rgba(255, 77, 77, 0.15);
          color: #ff4d4d;
        }

        .whitelist-table-wrapper {
          max-height: 350px;
          overflow-y: auto;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          background: rgba(0,0,0,0.1);
        }

        .tier-tag {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .tier-tag.vanguard { background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .tier-tag.partner { background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.15); color: #a855f7; }
        .tier-tag.alpha-tester { background: rgba(187, 255, 0, 0.08); border: 1px solid rgba(187, 255, 0, 0.15); color: var(--accent); }

        .spin {
          animation: loading-spin 1s linear infinite;
        }

        .font-mono {
          font-family: monospace;
        }

        @keyframes loading-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }

        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE LAYOUT BREAKPOINTS */
        @media (max-width: 1024px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100vw;
            height: auto;
            position: relative;
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
            padding: 1.5rem;
            overflow: visible; /* Let nav elements flow on mobile */
          }

          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            flex: none;
          }

          .nav-item {
            padding: 0.6rem 1rem;
            white-space: nowrap;
            font-size: 0.8rem;
          }

          .nav-item .chevron {
            display: none !important;
          }

          .sidebar-footer {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255,255,255,0.04);
            padding-top: 1rem;
            margin: 0;
          }

          .logout-btn {
            padding: 0.5rem 1rem;
          }

          .admin-main {
            max-width: 100vw;
            padding: 1.5rem;
          }

          .traffic-panel-quick {
            grid-column: span 12;
          }
        }

        .development-mode-container {
          position: relative;
          overflow: hidden;
        }

        .development-content-blurred {
          filter: blur(10px);
          pointer-events: none;
          user-select: none;
        }

        .development-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(3, 8, 6, 0.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          text-align: center;
          padding: 2rem;
          border-radius: inherit;
        }

        .development-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: var(--primary);
          padding: 0.8rem 1.6rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.15);
          margin-bottom: 1rem;
          animation: pulse-glow 2s infinite ease-in-out;
        }

        .development-text {
          color: #a0a0a0;
          font-size: 0.88rem;
          max-width: 320px;
          line-height: 1.5;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
            border-color: rgba(0, 255, 136, 0.25);
          }
          50% {
            box-shadow: 0 4px 30px rgba(0, 255, 136, 0.35);
            border-color: rgba(0, 255, 136, 0.6);
          }
        }

        /* ── TOAST NOTIFICATION ── */
        .partners-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          min-width: 300px;
          max-width: 420px;
          border-radius: 14px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid transparent;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: toast-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          overflow: hidden;
        }

        .partners-toast--success {
          background: rgba(0, 255, 136, 0.07);
          border-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,136,0.1) inset;
        }
        .partners-toast--success .toast-icon { color: #00ff88; }
        .partners-toast--success .toast-progress { background: linear-gradient(90deg, #00ff88, #00cc6a); }

        .partners-toast--error {
          background: rgba(255, 60, 80, 0.07);
          border-color: rgba(255, 60, 80, 0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,60,80,0.1) inset;
        }
        .partners-toast--error .toast-icon { color: #ff3c50; }
        .partners-toast--error .toast-progress { background: linear-gradient(90deg, #ff3c50, #cc2030); }

        .partners-toast--warning {
          background: rgba(255, 190, 50, 0.07);
          border-color: rgba(255, 190, 50, 0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,190,50,0.1) inset;
        }
        .partners-toast--warning .toast-icon { color: #ffbe32; }
        .partners-toast--warning .toast-progress { background: linear-gradient(90deg, #ffbe32, #cc8800); }

        .toast-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: currentColor;
          color: inherit;
        }
        .toast-icon svg { color: #000; }

        .toast-message {
          flex: 1;
          font-size: 0.88rem;
          font-weight: 600;
          color: #e8e8e8;
          line-height: 1.4;
          font-family: 'Space Grotesk', sans-serif;
        }

        .toast-close {
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          padding: 0.2rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .toast-close:hover { color: #fff; }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          border-radius: 0 0 14px 14px;
          animation: toast-progress 4s linear forwards;
          transform-origin: left;
        }

        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }

        /* ── LOGOUT CONFIRMATION MODAL ── */
        .logout-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlay-fade-in 0.2s ease forwards;
        }

        .logout-modal {
          background: rgba(8, 20, 14, 0.92);
          border: 1px solid rgba(0, 255, 136, 0.15);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 380px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.05) inset;
          animation: modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .logout-modal-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 60, 80, 0.08);
          border: 1px solid rgba(255, 60, 80, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff3c50;
          box-shadow: 0 0 24px rgba(255, 60, 80, 0.15);
          margin-bottom: 0.25rem;
        }

        .logout-modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .logout-modal-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin: 0;
          max-width: 280px;
        }

        .logout-modal-actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          margin-top: 0.5rem;
        }

        .logout-cancel-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Space Grotesk', sans-serif;
        }
        .logout-cancel-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.15);
        }

        .logout-confirm-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 60, 80, 0.35);
          background: rgba(255, 60, 80, 0.12);
          color: #ff3c50;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          font-family: 'Space Grotesk', sans-serif;
        }
        .logout-confirm-btn:hover {
          background: rgba(255, 60, 80, 0.25);
          border-color: rgba(255, 60, 80, 0.6);
          box-shadow: 0 0 16px rgba(255, 60, 80, 0.2);
          color: #ff6070;
        }

        @keyframes overlay-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
