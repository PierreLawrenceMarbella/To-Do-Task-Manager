package com.momentum.tasks.widget

import org.junit.Assert.assertEquals
import org.junit.Test

class WidgetLogicTest {
    @Test
    fun filtersTodaySortsPendingAndCalculatesProgress() {
        val tasks = listOf(
            WidgetTask("1", "Finished", "2030-06-10", "08:00", true),
            WidgetTask("2", "Later", "2030-06-10", "11:00", false),
            WidgetTask("3", "Earlier", "2030-06-10", "09:00", false),
            WidgetTask("4", "Tomorrow", "2030-06-11", "07:00", false)
        )

        val summary = getWidgetSummary(tasks, "2030-06-10")

        assertEquals(3, summary.total)
        assertEquals(1, summary.completed)
        assertEquals(33, summary.percentage)
        assertEquals(listOf("3", "2"), summary.pending.map { it.id })
    }
}
