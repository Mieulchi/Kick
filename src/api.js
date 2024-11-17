export async function fetchChatResponse(userMessage) {
    const API_URL = "https://api.openai.com/v1/chat/completions";
  
    try {
  
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant specializing in food recommendations. Based on the user's preferences, suggest dishes or foods. For example, if the user asks for spicy food, recommend spicy dishes."
            },
            { role: "user", content: userMessage },
          ],
        }),
        
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!data.choices || data.choices.length === 0) {
        throw new Error("Empty or invalid 'choices' array in response.");
      }
  
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching chat response:", error);
      return "Sorry, something went wrong. Please try again later.";
    }
  }
  