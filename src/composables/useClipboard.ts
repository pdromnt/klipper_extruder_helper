import { ref } from 'vue';

export function useClipboard() {
  const copied = ref(false);
  const copyError = ref<string | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    copyError.value = null;

    // Check if clipboard API is available
    if (!navigator.clipboard) {
      copyError.value = 'Clipboard not supported in this browser';
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;

      // Reset copied state after 2 seconds
      setTimeout(() => {
        copied.value = false;
      }, 2000);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      copyError.value = `Failed to copy: ${errorMessage}`;
      console.error('Failed to copy text:', err);
      return false;
    }
  };

  return {
    copied,
    copyError,
    copyToClipboard,
  };
}
