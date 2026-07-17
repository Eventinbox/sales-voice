"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";
import Button from "@/components/Button";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile || isEditing) return;
    setName(profile.name);
    setShopName(profile.shopName);
  }, [profile, isEditing]);

  if (isLoading || !profile) {
    return (
      <div className="px-5 py-6 pb-24 md:max-w-2xl md:mx-auto md:px-10 md:py-10 md:pb-10">
        <div className="rounded-market border border-surface-container-high bg-surface-container-lowest p-6 text-center text-on-surface-variant">
          Loading profile...
        </div>
      </div>
    );
  }

  const currentProfile = profile!;

  function handleEdit() {
    setName(currentProfile.name);
    setShopName(currentProfile.shopName);
    setSaved(false);
    setIsEditing(true);
  }

  function handleSave() {
    updateProfile({
      name: name.trim() || currentProfile.name,
      shopName: shopName.trim() || currentProfile.shopName,
    });
    setIsEditing(false);
    setSaved(true);
  }

  function handleCancel() {
    setName(currentProfile.name);
    setShopName(currentProfile.shopName);
    setIsEditing(false);
  }

  return (
    <div className="px-5 py-6 pb-24 space-y-8 md:max-w-2xl md:mx-auto md:px-10 md:py-10 md:pb-10">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-headline-lg font-bold flex-1">Profile</h1>
        {!isEditing && (
          <button onClick={handleEdit} className="p-2 text-primary" aria-label="Edit profile">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </header>

      <div className="flex flex-col items-center gap-3">
        <img
          src={currentProfile.avatar}
          alt={currentProfile.name}
          className="w-24 h-24 rounded-full border-4 border-primary"
        />
        {isEditing && (
          <button
            type="button"
            aria-label="Change photo (not yet implemented)"
            className="text-label-lg font-bold text-primary"
          >
            Change Photo
          </button>
        )}
      </div>

      <section className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 space-y-5">
        <div className="space-y-2">
          <label htmlFor="profile-name" className="text-label-lg text-on-surface-variant">
            Name
          </label>
          {isEditing ? (
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md focus:border-primary"
            />
          ) : (
            <p className="text-body-lg font-bold">{currentProfile.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-shop-name" className="text-label-lg text-on-surface-variant">
            Shop Name
          </label>
          {isEditing ? (
            <input
              id="profile-shop-name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full h-[48px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md focus:border-primary"
            />
          ) : (
            <p className="text-body-lg font-bold">{currentProfile.shopName}</p>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-label-lg text-on-surface-variant">Phone Number</span>
          <p className="text-body-lg font-bold text-on-surface-variant">{currentProfile.phone}</p>
        </div>
      </section>

      {isEditing ? (
        <div className="flex gap-3">
          <Button label="Save Changes" onClick={handleSave} className="flex-1" />
          <Button label="Cancel" variant="outline" onClick={handleCancel} className="flex-1" />
        </div>
      ) : saved ? (
        <p className="text-center text-primary font-bold">Profile updated ✓</p>
      ) : null}
    </div>
  );
}
