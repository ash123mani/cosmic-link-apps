const { withMainActivity } = require('expo/config-plugins');

module.exports = function withShareIntent(config) {
  return withMainActivity(config, (config) => {
    let content = config.modResults.contents;

    if (!content.includes('import android.content.Intent')) {
      content = content.replace(
        /^package[\s\S]*?\n/m,
        (match) => match + `import android.content.Intent
import android.net.Uri
import android.util.Log

`
      );
    }

    if (!content.includes('handleShareIntent(intent)')) {
      if (content.includes('SplashScreenManager.registerOnActivity(this)')) {
        content = content.replace(
          'SplashScreenManager.registerOnActivity(this)',
          'SplashScreenManager.registerOnActivity(this)\n    handleShareIntent(intent)'
        );
      } else {
        content = content.replace(
          'super.onCreate(null)',
          '    handleShareIntent(intent)\n    super.onCreate(null)'
        );
      }
    }

    if (!content.includes('private fun handleShareIntent')) {
      const methods = `

  override fun onNewIntent(intent: Intent) {
    handleShareIntent(intent)
    super.onNewIntent(intent)
    setIntent(intent)
  }

  private fun handleShareIntent(intent: Intent) {
    if (Intent.ACTION_SEND == intent.action && "text/plain" == intent.type) {
      val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
      if (sharedText != null) {
        val url = extractUrl(sharedText)
        if (url != null) {
          Log.d("CosmicLink", "Share intent received: $url")
          val deepLink = Uri.Builder()
            .scheme("cosmiclinkreactnative")
            .authority("share")
            .appendQueryParameter("url", url)
            .build()
            .toString()
          intent.action = Intent.ACTION_VIEW
          intent.data = Uri.parse(deepLink)
        }
      }
    }
  }

  private fun extractUrl(text: String): String? {
    val pattern = Regex("https?://[^\\\\s]+")
    return pattern.find(text)?.value
  }
`;

      const lastBrace = content.lastIndexOf('}');
      if (lastBrace !== -1) {
        content = content.slice(0, lastBrace) + methods + '\n' + content.slice(lastBrace);
      }
    }

    config.modResults.contents = content;
    return config;
  });
};
