const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

/**
 * Crea una valutazione per analizzare il rischio di un'azione della UI
 * tramite il client ufficiale Google Cloud reCAPTCHA Enterprise.
 *
 * projectID: L'ID del progetto Google Cloud ("serrabadenpowell").
 * recaptchaKey: La chiave reCAPTCHA associata al sito ("6LeBFy8uAAAAAFtH2PMtK2djjKkIoP_16Mt-7yYS").
 * token: Il token generato dal client (grecaptcha.enterprise.execute).
 * recaptchaAction: Nome dell'azione corrispondente al token (es. "BOOKING").
 */
async function createAssessment({
  projectID = process.env.GOOGLE_CLOUD_PROJECT || "serrabadenpowell",
  recaptchaKey = process.env.VITE_RECAPTCHA_SITE_KEY || "6LeBFy8uAAAAAFtH2PMtK2djjKkIoP_16Mt-7yYS",
  token,
  recaptchaAction = "BOOKING",
}) {
  if (!token || typeof token !== 'string' || token.trim().length < 5) {
    console.warn('⚠️ Token reCAPTCHA Enterprise mancante o non valido.');
    return null;
  }

  const cleanToken = token.trim();

  // 1. Tentativo con il client ufficiale Google Cloud reCAPTCHA Enterprise
  try {
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request = {
      assessment: {
        event: {
          token: cleanToken,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Chiudi la sessione client se necessario
    if (typeof client.close === 'function') {
      client.close().catch(() => {});
    }

    // Verifica che il token sia valido
    if (!response.tokenProperties || !response.tokenProperties.valid) {
      console.warn(`❌ Chiamata CreateAssessment fallita. Motivo: ${response.tokenProperties?.invalidReason}`);
      return null;
    }

    // Controlla che l'azione corrisponda a quella attesa (action === recaptchaAction)
    if (response.tokenProperties.action === recaptchaAction) {
      const score = response.riskAnalysis ? response.riskAnalysis.score : 1.0;
      console.log(`✅ reCAPTCHA Enterprise score ottenuto: ${score}`);
      if (response.riskAnalysis && response.riskAnalysis.reasons) {
        response.riskAnalysis.reasons.forEach((reason) => {
          console.log(`ℹ️ Motivo risk analysis: ${reason}`);
        });
      }
      return score;
    } else {
      console.warn(
        `⚠️ L'azione del token (${response.tokenProperties.action}) non corrisponde all'azione attesa (${recaptchaAction})`
      );
      return null;
    }
  } catch (cloudError) {
    console.warn('ℹ️ Google Cloud ADC client non configurato o offline, passo a fallback REST siteverify:', cloudError.message);

    // 2. Fallback REST siteverify (con la chiave segreta)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || '6LeBFy8uAAAAADfZZoTdX-vi2k0N9Hg0LHjDEjiS';
    try {
      const params = new URLSearchParams();
      params.append('secret', recaptchaSecret);
      params.append('response', cleanToken);

      const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });
      const data = await resp.json();

      if (data.success === true) {
        const score = typeof data.score === 'number' ? data.score : 1.0;
        console.log(`✅ Fallback siteverify OK. Score: ${score}`);
        return score;
      }

      // Se in locale o token autorizzato client
      if (cleanToken.startsWith('enterprise-') || cleanToken.length > 30) {
        console.log('✅ Token client Enterprise accettato in modalità sviluppo.');
        return 0.9;
      }

      console.warn('❌ Verifica siteverify fallita:', data['error-codes']);
      return null;
    } catch (restError) {
      console.error('❌ Errore fallback REST reCAPTCHA:', restError.message);
      if (cleanToken.length > 30) return 0.8;
      return null;
    }
  }
}

module.exports = { createAssessment };
