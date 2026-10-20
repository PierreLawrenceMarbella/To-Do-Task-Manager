package com.momentum.tasks.widget

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.text.format.DateFormat
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.LocalSize
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.action.clickable
import com.momentum.tasks.MainActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MomentumWidget : GlanceAppWidget() {
    override val sizeMode = SizeMode.Responsive(
        setOf(DpSize(140.dp, 110.dp), DpSize(280.dp, 110.dp))
    )

    override suspend fun provideGlance(context: Context, id: androidx.glance.GlanceId) {
        val payload = WidgetStorage.load(context)
        provideContent { WidgetContent(payload) }
    }
}

@Composable
private fun WidgetContent(payload: WidgetPayload) {
    val context = LocalContext.current
    val maxRows = if (LocalSize.current.width < 220.dp) 2 else 4
    val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    val summary = getWidgetSummary(payload.tasks, today)
    val accent = parseColor(payload.accentColor)

    Column(
        modifier = GlanceModifier.fillMaxSize().cornerRadius(24.dp).background(ColorProvider(ComposeColor.White)).padding(16.dp)
    ) {
        Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = GlanceModifier.defaultWeight()) {
                Text("TODAY", style = TextStyle(color = ColorProvider(accent), fontWeight = FontWeight.Bold))
                Text("${summary.completed} of ${summary.total} complete", style = TextStyle(color = ColorProvider(ComposeColor(0xFF64748B))))
            }
            Text("${summary.percentage}%", style = TextStyle(color = ColorProvider(accent), fontWeight = FontWeight.Bold))
        }
        Spacer(GlanceModifier.height(8.dp))

        if (summary.pending.isEmpty()) {
            Text(
                if (summary.total == 0) "Nothing due today" else "All done for today ✓",
                style = TextStyle(color = ColorProvider(ComposeColor(0xFF334155)), fontWeight = FontWeight.Medium),
                maxLines = 2
            )
        } else {
            summary.pending.take(maxRows).forEach { task -> TaskRow(context, task, accent) }
            val remaining = summary.pending.size - maxRows
            if (remaining > 0) Text("+$remaining more", style = TextStyle(color = ColorProvider(accent), fontWeight = FontWeight.Bold))
        }
    }
}

@Composable
private fun TaskRow(context: Context, task: WidgetTask, accent: ComposeColor) {
    val intent = Intent(context, MainActivity::class.java).apply {
        action = Intent.ACTION_VIEW
        data = Uri.parse("momentum://task/${Uri.encode(task.id)}")
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    Row(
        modifier = GlanceModifier.fillMaxWidth().clickable(actionStartActivity(intent)).padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("•", style = TextStyle(color = ColorProvider(accent), fontWeight = FontWeight.Bold))
        Spacer(GlanceModifier.width(6.dp))
        Text(task.title, modifier = GlanceModifier.defaultWeight(), style = TextStyle(color = ColorProvider(ComposeColor(0xFF0F172A)), fontWeight = FontWeight.Medium), maxLines = 1)
        if (task.dueTime.isNotBlank()) {
            Spacer(GlanceModifier.width(6.dp))
            Text(formatTime(context, task.dueTime), style = TextStyle(color = ColorProvider(ComposeColor(0xFF64748B))), maxLines = 1)
        }
    }
}

private fun formatTime(context: Context, value: String): String {
    val date = try { SimpleDateFormat("HH:mm", Locale.US).parse(value) } catch (_: Exception) { null }
    return if (date == null) value else DateFormat.getTimeFormat(context).format(date)
}

private fun parseColor(value: String): ComposeColor = try {
    ComposeColor(Color.parseColor(value))
} catch (_: Exception) {
    ComposeColor(0xFF6D5DFC)
}
