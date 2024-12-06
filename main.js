async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { http } = utils;
    const { fetch, Body } = http;

    // API endpoint for SimpleTex
    const apiUrl = 'https://server.simpletex.cn/api/simpletex_ocr';

    // Validate API key
    const apiKey = config.apikey;
    if (!apiKey) {
        throw new Error('API Key is required');
    }

    // Prepare form data
    const formData = new FormData();
    
    // Decode base64 image
    const imageBuffer = Buffer.from(base64, 'base64');
    formData.append('file', imageBuffer, {
        filename: 'image.png',
        contentType: 'image/png'
    });

    // Optional: Set recognition mode (auto/document/formula)
    formData.append('rec_mode', 'auto');

    // Optional: Enable image rotation correction
    formData.append('enable_img_rot', 'false');

    try {
        // Perform the API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                // Other necessary headers
            },
            body: formData
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response
        const result = await response.json();

        // Extract and return the recognized text
        // The exact field may vary - you might need to adjust based on actual API response
        return result.markdown || result.text || '';

    } catch (error) {
        console.error('SimpleTex OCR Recognition Error:', error);
        throw error;
    }
}
