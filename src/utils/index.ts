export const truncateAddress = (address: string | undefined) => {
  if (address) {
    const first4Chars = address.slice(0, 4);
    const last4Chars = address.slice(40, 44);
    return first4Chars + '...' + last4Chars;
  }
};
