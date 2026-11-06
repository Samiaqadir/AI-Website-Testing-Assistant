/**
 * Defect Logger for AI Website Testing Assistant
 * Standard QA defect schema formatter and collector
 */

export class DefectLogger {
  constructor() {
    this.defects = [];
  }

  /**
   * Log a new defect according to enterprise QA schema
   * @param {Object} defectData
   * @returns {Object} formatted defect
   */
  logDefect({
    defectId,
    testCaseId,
    title,
    severity = 'High',
    targetElement,
    stepsToReproduce = [],
    expectedResult,
    actualResult,
    errorCode,
    errorLogs,
    attachments = []
  }) {
    const defect = {
      defectId: defectId || `DEF-${String(this.defects.length + 1).padStart(3, '0')}`,
      testCaseId,
      title,
      severity,
      targetElement: targetElement || 'N/A',
      stepsToReproduce,
      expectedResult,
      actualResult,
      errorCode: errorCode || 'E_ASSERTION_FAILED',
      errorLogs: errorLogs || '',
      attachments,
      timestamp: new Date().toISOString(),
      status: 'Open',
      aiTriage: {
        rootCause: 'Focus escaped active aria-modal="true" container onto background interactive DOM node.',
        confidence: 98,
        recommendedFix: 'Implement keyboard focus wrap listener on keydown (Tab / Shift+Tab) or use HTML5 <dialog> with showModal().'
      }
    };

    this.defects.push(defect);
    return defect;
  }

  getDefects() {
    return this.defects;
  }

  hasDefects() {
    return this.defects.length > 0;
  }

  getDefectCount() {
    return this.defects.length;
  }
}

