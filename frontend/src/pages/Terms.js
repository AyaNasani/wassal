import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center" color="primary">
          📋 الشروط والأحكام
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>1. الخصوصية للطلاب</Typography>
          <Typography paragraph>
            المنصة مخصصة لطلاب جامعة الشمال الخاصة فقط.
          </Typography>

          <Typography variant="h6" gutterBottom>2. المحتوى المسموح</Typography>
          <Typography paragraph>
            يمنع نشر أي محتوى مخالف للقانون أو غير أخلاقي.
          </Typography>

          <Typography variant="h6" gutterBottom>3. المسؤولية</Typography>
          <Typography paragraph>
            يتحمل صاحب الإعلان مسؤولية المعلومات المنشورة.
          </Typography>

          <Typography variant="h6" gutterBottom>4. المراجعة</Typography>
          <Typography paragraph>
            جميع الإعلانات تخضع لمراجعة الإدارة قبل النشر.
          </Typography>

          <Typography variant="h6" gutterBottom>5. الاحترام</Typography>
          <Typography paragraph>
            يجب احترام جميع المستخدمين.
          </Typography>

          <Typography variant="h6" gutterBottom>6. الحسابات</Typography>
          <Typography paragraph>
            يحق للإدارة تعليق أو حذف أي حساب مخالف.
          </Typography>

          <Typography variant="h6" gutterBottom>7. التواصل</Typography>
          <Typography paragraph>
            عمليات البيع والإعارة والتبرع هي مسؤولية الأطراف المتعاملة.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}