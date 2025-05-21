const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Send to cloudseek.io domain
    await fetch('https://api.cloudseek.io/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    setIsSubmitted(true);
    setEmail('');
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
  }
}; 