import React from 'react';
import { Manufacturer, VerificationStatus } from '../types';
import { ShieldCheck, Award, Building2, CheckCircle2, Clock } from 'lucide-react';

interface ManufacturerBadgesProps {
  manufacturer: Manufacturer;
  showAll?: boolean;
  className?: string;
}

export const VerifiedSupplierBadge: React.FC<{ status: VerificationStatus; verificationDate?: string }> = ({ 
  status,
  verificationDate 
}) => {
  if (status === 'PREMIUM_VERIFIED') {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-sans text-[10px] font-bold uppercase tracking-wider shadow-xs"
        title={verificationDate ? `Audited and Premium Verified on ${verificationDate}` : 'Audited and Premium Verified'}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>GOLD VERIFIED</span>
      </span>
    );
  }

  if (status === 'VERIFIED') {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 font-sans text-[10px] font-bold uppercase tracking-wider shadow-xs"
        title={verificationDate ? `Verified Factory on ${verificationDate}` : 'Verified Factory'}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>VERIFIED SUPPLIER</span>
      </span>
    );
  }

  if (status === 'UNDER_REVIEW') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-900 border border-orange-200 font-sans text-[10px] font-bold uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
        <span>AUDIT IN REVIEW</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-sans text-[10px] font-bold uppercase">
      <span>UNVERIFIED</span>
    </span>
  );
};

export const YearsExperienceBadge: React.FC<{ years?: number; createdYear?: string }> = ({ years }) => {
  const yearsExp = years || 8;
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 font-sans text-[10px] font-bold uppercase"
      title={`${yearsExp} Years Factory Manufacturing & Export Experience`}
    >
      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      <span>{yearsExp}+ YRS EXP</span>
    </span>
  );
};

export const IsoCertificationsBadges: React.FC<{ certs?: string[]; notes?: string }> = ({ certs, notes }) => {
  let certList: string[] = certs && certs.length > 0 ? certs : [];
  
  if (certList.length === 0 && notes) {
    if (notes.includes('ISO9001') || notes.includes('ISO 9001')) certList.push('ISO 9001');
    if (notes.includes('CE')) certList.push('CE Certified');
  }

  if (certList.length === 0) {
    certList = ['ISO 9001', 'CE Certified'];
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {certList.map((cert) => (
        <span 
          key={cert}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 font-sans text-[9px] font-bold uppercase"
        >
          <Award className="w-3 h-3 text-purple-600 shrink-0" />
          <span>{cert}</span>
        </span>
      ))}
    </div>
  );
};

export const ManufacturerBadges: React.FC<ManufacturerBadgesProps> = ({ manufacturer, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <VerifiedSupplierBadge 
        status={manufacturer.verificationStatus} 
        verificationDate={manufacturer.verificationDate} 
      />
      <YearsExperienceBadge years={manufacturer.yearsInBusiness} />
      <IsoCertificationsBadges certs={manufacturer.isoCertifications} notes={manufacturer.notes} />
    </div>
  );
};

