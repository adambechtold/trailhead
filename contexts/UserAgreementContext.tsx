import React, { createContext, useContext, useEffect, useState } from "react";

type UserAgreementContextProviderProps = {
  children: React.ReactNode;
};

type UserAgreementContext = {
  hasAgreedToUserAgreement: boolean;
  setHasAgreedToUserAgreement: (hasAgreed: boolean) => void;
};

const UserAgreementContext = createContext<UserAgreementContext | null>(null);

export default function UserAgreementContextProvider({
  children,
}: UserAgreementContextProviderProps) {
  const [hasAgreed, setHasAgreed] = useState(true);

  useEffect(() => {
    localStorage.getItem("hasAgreedToUserAgreement") === "true"
      ? setHasAgreed(true)
      : setHasAgreed(false);
  }, []);

  const setHasAgreedToUserAgreement = (hasAgreed: boolean) => {
    setHasAgreed(hasAgreed);
    localStorage.setItem("hasAgreedToUserAgreement", hasAgreed.toString());
  };

  return (
    <UserAgreementContext.Provider
      value={{
        hasAgreedToUserAgreement: hasAgreed,
        setHasAgreedToUserAgreement,
      }}
    >
      {children}
    </UserAgreementContext.Provider>
  );
}

export function useUserAgreementContext() {
  const context = useContext(UserAgreementContext);
  if (!context) {
    throw new Error(
      "useUserAgreementContext must be used within a UserAgreementContextProvider"
    );
  }
  return context;
}
