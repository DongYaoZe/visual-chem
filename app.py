import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from scipy.optimize import brentq

# ----------------------------------------------------
# 1. PAGE CONFIGURATION & CUSTOM STYLE
# ----------------------------------------------------
st.set_page_config(
    page_title="相图交互式可视化与结晶分离平台",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom premium CSS
st.markdown("""
<style>
    /* Import Google Font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    /* Main title styling */
    .main-title {
        background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 2.8rem;
        margin-bottom: 0.2rem;
        text-align: center;
    }
    
    .subtitle {
        color: #6B7280;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 400;
    }
    
    /* Premium card container styling */
    .premium-card {
        background-color: #F9FAFB;
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #E5E7EB;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        margin-bottom: 1.5rem;
    }
    
    .dark .premium-card {
        background-color: #1F2937;
        border: 1px solid #374151;
    }
    
    /* Headers inside cards */
    .card-header {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
        border-bottom: 2px solid #4F46E5;
        padding-bottom: 0.3rem;
    }
    
    .dark .card-header {
        color: #F9FAFB;
    }
    
    /* Highlight text */
    .highlight {
        color: #4F46E5;
        font-weight: 600;
    }
    
    /* Tab headers */
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
        justify-content: center;
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: transparent;
        border-radius: 4px;
        font-weight: 600;
        font-size: 1.05rem;
    }
    
    .stTabs [aria-selected="true"] {
        color: #4F46E5 !important;
        border-bottom-color: #4F46E5 !important;
    }
</style>
""", unsafe_allow_html=True)

# Main Title
st.markdown('<div class="main-title">物理化学相图交互式可视化平台</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">基于热力学相平衡方程的二元、三元系统动态模拟与工业分盐工艺设计</div>', unsafe_allow_html=True)

# Gas constant in J/(mol*K)
R = 8.31446

# ----------------------------------------------------
# 2. HELPER THERMODYNAMIC FUNCTIONS
# ----------------------------------------------------

# (a) Antoine Equation for Vapor Pressure (mmHg or bar)
# log10(p*) = A - B / (T + C) -> p* in bar
# T in °C
def antoine_p(T_C, A, B, C):
    log10_p_mmHg = A - B / (T_C + C)
    p_mmHg = 10**log10_p_mmHg
    return p_mmHg / 750.062

# Inverse Antoine: Solve for boiling temperature at pressure P (bar)
def antoine_T(p_bar, A, B, C):
    p_mmHg = p_bar * 750.062
    return B / (A - np.log10(p_mmHg)) - C

# Margules activity coefficients (1-parameter model)
# A_marg: dimensionless interaction parameter Omega / (R * T)
def activity_coeff(x_A, A_marg):
    gamma_A = np.exp(A_marg * (1.0 - x_A)**2)
    gamma_B = np.exp(A_marg * x_A**2)
    return gamma_A, gamma_B

# Solve for LLE compositions if A_marg > 2
def solve_lle(A_marg):
    if A_marg <= 2.0:
        return None
    s = brentq(lambda s: np.arctanh(s) - 0.5 * A_marg * s, 1e-7, 1.0 - 1e-7)
    x1 = (1.0 - s) / 2.0
    x2 = (1.0 + s) / 2.0
    return x1, x2

# ----------------------------------------------------
# 3. TABS DEFINITION
# ----------------------------------------------------
tab1, tab2, tab3, tab4 = st.tabs([
    "📊 二元气液平衡 (VLE)", 
    "❄️ 二元固液平衡 (SLE)", 
    "🧪 三元体系与分盐模拟",
    "📖 物理化学理论推导"
])

# ====================================================
# TAB 1: BINARY VLE (气液平衡)
# ====================================================
with tab1:
    st.markdown('<div class="card-header">二元汽液平衡相图 (VLE)</div>', unsafe_allow_html=True)
    
    col_vle_ctrl, col_vle_plot = st.columns([1, 2])
    
    with col_vle_ctrl:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        st.subheader("💡 体系物理化学参数")
        
        # Select System Pre-set
        system_preset = st.selectbox(
            "选择预设二元体系",
            ["苯 - 甲苯 (近似理想)", "正己烷 - 正庚烷 (理想)", "乙醇 - 水 (非理想共沸)", "部分互溶双液系 (LLE-VLE 共存)", "自定义"],
            key="sys_preset_vle"
        )
        
        if system_preset == "苯 - 甲苯 (近似理想)":
            antoine_A_A, antoine_A_B, antoine_A_C = 6.89272, 1203.531, 219.888  # Benzene
            antoine_B_A, antoine_B_B, antoine_B_C = 6.95805, 1346.773, 219.693  # Toluene
            default_A_marg = 0.0
            name_A, name_B = "苯 (A)", "甲苯 (B)"
        elif system_preset == "正己烷 - 正庚烷 (理想)":
            antoine_A_A, antoine_A_B, antoine_A_C = 6.87601, 1171.17, 224.41    # Hexane
            antoine_B_A, antoine_B_B, antoine_B_C = 6.90253, 1269.82, 216.76    # Heptane
            default_A_marg = 0.0
            name_A, name_B = "正己烷 (A)", "正庚烷 (B)"
        elif system_preset == "乙醇 - 水 (非理想共沸)":
            antoine_A_A, antoine_A_B, antoine_A_C = 8.04494, 1554.3, 222.65    # Ethanol
            antoine_B_A, antoine_B_B, antoine_B_C = 8.07131, 1730.63, 233.426   # Water
            default_A_marg = 1.6  # Gives a minimum boiling azeotrope
            name_A, name_B = "乙醇 (A)", "水 (B)"
        elif system_preset == "部分互溶双液系 (LLE-VLE 共存)":
            antoine_A_A, antoine_A_B, antoine_A_C = 7.5, 1200.0, 220.0  # Component A (Organic)
            antoine_B_A, antoine_B_B, antoine_B_C = 8.0, 1600.0, 230.0  # Component B (Water-like)
            default_A_marg = 2.5
            name_A, name_B = "有机物 A", "水 B"
        else:
            antoine_A_A = st.number_input("A 的 Antoine A", value=6.89272, format="%.5f")
            antoine_A_B = st.number_input("A 的 Antoine B", value=1203.531, format="%.3f")
            antoine_A_C = st.number_input("A 的 Antoine C", value=219.888, format="%.3f")
            
            antoine_B_A = st.number_input("B 的 Antoine A", value=6.95805, format="%.5f")
            antoine_B_B = st.number_input("B 的 Antoine B", value=1346.773, format="%.3f")
            antoine_B_C = st.number_input("B 的 Antoine C", value=219.693, format="%.3f")
            default_A_marg = 0.0
            name_A, name_B = "组分 A", "组分 B"
            
        st.subheader("⚙️ 调节状态与非理想性")
        if system_preset == "部分互溶双液系 (LLE-VLE 共存)":
            Omega_lle = st.slider("液液相互作用参数 Ω (J/mol)", min_value=5000.0, max_value=12000.0, value=7500.0, step=100.0,
                                  help="值越大，互溶度越小，会溶温度（UCST）越高。对应教科书图 12.10。")
            diagram_type = st.radio("相图展示类型", ["p-x 恒温图", "T-x 恒压图"])
            if diagram_type == "p-x 恒温图":
                T_const = st.slider("恒定温度 T (°C)", min_value=0.0, max_value=150.0, value=80.0, step=1.0)
                P_const = 1.013
                A_marg = Omega_lle / (R * (T_const + 273.15))
            else:
                P_const = st.slider("恒定压力 p (bar)", min_value=0.1, max_value=5.0, value=1.013, step=0.1)
                T_const = 80.0
                A_marg = 2.5 # dummy
        else:
            A_marg = st.slider("液相相互作用参数 A (Margules)", min_value=-1.0, max_value=3.0, value=default_A_marg, step=0.1,
                               help="A=0为理想溶液；A>0表示正偏差，A>2时将导致液液相分离；A<0表示负偏差。对应公式 (12.20)。")
            diagram_type = st.radio("相图展示类型", ["p-x 恒温图", "T-x 恒压图"])
            if diagram_type == "p-x 恒温图":
                T_const = st.slider("恒定温度 T (°C)", min_value=0.0, max_value=150.0, value=80.0, step=1.0)
                P_const = 1.013
            else:
                P_const = st.slider("恒定压力 p (bar)", min_value=0.1, max_value=5.0, value=1.013, step=0.1)
                T_const = 80.0
                
        z_A = st.slider("系统总组成 z_A (摩尔分数)", min_value=0.0, max_value=1.0, value=0.4, step=0.01)
        
        st.markdown('</div>', unsafe_allow_html=True)
        
    with col_vle_plot:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        
        if system_preset == "部分互溶双液系 (LLE-VLE 共存)" and diagram_type == "T-x 恒压图":
            # ------------------------------------------------
            # CUSTOM PLOTTER FOR ISOBARIC LLE-VLE OVERLAP (图 12.10)
            # ------------------------------------------------
            T_A_boil = antoine_T(P_const, antoine_A_A, antoine_A_B, antoine_A_C)
            T_B_boil = antoine_T(P_const, antoine_B_A, antoine_B_B, antoine_B_C)
            T_ucst = Omega_lle / (2.0 * R)
            
            def get_lle_at_T(T_K):
                A_m = Omega_lle / (R * T_K)
                if A_m <= 2.0:
                    return None
                try:
                    s = brentq(lambda s: np.arctanh(s) - 0.5 * A_m * s, 1e-7, 1.0 - 1e-7)
                    return (1.0 - s) / 2.0, (1.0 + s) / 2.0
                except:
                    return None
                    
            def vlle_res(T_K):
                lle = get_lle_at_T(T_K)
                if lle is None:
                    return -999.0
                x1, x2 = lle
                gA, gB = activity_coeff(x1, Omega_lle / (R * T_K))
                pA = antoine_p(T_K - 273.15, antoine_A_A, antoine_A_B, antoine_A_C)
                pB = antoine_p(T_K - 273.15, antoine_B_A, antoine_B_B, antoine_B_C)
                return x1 * gA * pA + (1.0 - x1) * gB * pB - P_const
                
            has_vlle = False
            try:
                T_VLLE_K = brentq(vlle_res, 273.15, T_ucst - 0.1)
                T_VLLE_C = T_VLLE_K - 273.15
                x1_vlle, x2_vlle = get_lle_at_T(T_VLLE_K)
                gA_vlle, gB_vlle = activity_coeff(x1_vlle, Omega_lle / (R * T_VLLE_K))
                pA_vlle = antoine_p(T_VLLE_C, antoine_A_A, antoine_A_B, antoine_A_C)
                y_VLLE = (x1_vlle * gA_vlle * pA_vlle) / P_const
                has_vlle = True
            except:
                has_vlle = False
                
            if not has_vlle:
                st.warning("⚠️ 在当前压力下，气液平衡温度高于液液会溶温度（UCST），未发生液液分层，体系呈完全互溶。")
                A_marg_fallback = Omega_lle / (R * (80.0 + 273.15))
                st.info("已切换为普通共沸相图模式，请尝试降低压力 p 或增加交互参数 Ω 以显示分层。")
                
                # Standard plotter fallback logic
                x_grid = np.linspace(1e-5, 1-1e-5, 200)
                T_bubble = []
                y_A_arr = []
                T_min = min(T_A_boil, T_B_boil) - 20
                T_max = max(T_A_boil, T_B_boil) + 20
                success = True
                for x in x_grid:
                    gA, gB = activity_coeff(x, A_marg_fallback)
                    def resid(T):
                        pa = antoine_p(T, antoine_A_A, antoine_A_B, antoine_A_C)
                        pb = antoine_p(T, antoine_B_A, antoine_B_B, antoine_B_C)
                        return x * gA * pa + (1.0 - x) * gB * pb - P_const
                    try:
                        T_sol = brentq(resid, T_min, T_max)
                        T_bubble.append(T_sol)
                        pa = antoine_p(T_sol, antoine_A_A, antoine_A_B, antoine_A_C)
                        y_A_arr.append((x * gA * pa) / P_const)
                    except:
                        success = False
                        break
                if success:
                    T_bubble = np.array(T_bubble)
                    y_A_arr = np.array(y_A_arr)
                    T_sys = st.slider("设定系统温度 T (°C)", min_value=float(np.min(T_bubble)-5), max_value=float(np.max(T_bubble)+5), value=float(np.mean(T_bubble)), step=0.5)
                    fig = go.Figure()
                    fig.add_trace(go.Scatter(x=x_grid, y=T_bubble, mode='lines', name='液相线 (Bubble Point)', line=dict(color='#4F46E5', width=3)))
                    fig.add_trace(go.Scatter(x=y_A_arr, y=T_bubble, mode='lines', name='气相线 (Dew Point)', line=dict(color='#06B6D4', width=3, dash='dash')))
                    fig.add_trace(go.Scatter(x=[z_A], y=[T_sys], mode='markers', name='系统状态点', marker=dict(color='#10B981', size=12, symbol='diamond')))
                    st.plotly_chart(fig, use_container_width=True)
            else:
                # 1. Generate LLE curve from -10°C to T_VLLE_C
                T_lle_grid = np.linspace(-10.0, T_VLLE_C, 100)
                x1_lle = []
                x2_lle = []
                for Tc in T_lle_grid:
                    lle = get_lle_at_T(Tc + 273.15)
                    if lle is not None:
                        x1_lle.append(lle[0])
                        x2_lle.append(lle[1])
                    else:
                        x1_lle.append(0.5)
                        x2_lle.append(0.5)
                
                # 2. Generate VLE Loop 1 (B-rich, x <= x1_vlle)
                x_grid_1 = np.linspace(1e-5, x1_vlle, 100)
                T_bubble_1 = []
                y_dew_1 = []
                for x in x_grid_1:
                    def bubble_res(T_C):
                        gA, gB = activity_coeff(x, Omega_lle / (R * (T_C + 273.15)))
                        pa = antoine_p(T_C, antoine_A_A, antoine_A_B, antoine_A_C)
                        pb = antoine_p(T_C, antoine_B_A, antoine_B_B, antoine_B_C)
                        return x * gA * pa + (1.0 - x) * gB * pb - P_const
                    try:
                        T_sol = brentq(bubble_res, T_VLLE_C - 5, T_B_boil + 5)
                        T_bubble_1.append(T_sol)
                        gA, gB = activity_coeff(x, Omega_lle / (R * (T_sol + 273.15)))
                        pa = antoine_p(T_sol, antoine_A_A, antoine_A_B, antoine_A_C)
                        y_dew_1.append((x * gA * pa) / P_const)
                    except:
                        T_bubble_1.append(T_VLLE_C)
                        y_dew_1.append(y_VLLE)
                        
                # 3. Generate VLE Loop 2 (A-rich, x >= x2_vlle)
                x_grid_2 = np.linspace(x2_vlle, 1.0 - 1e-5, 100)
                T_bubble_2 = []
                y_dew_2 = []
                for x in x_grid_2:
                    def bubble_res(T_C):
                        gA, gB = activity_coeff(x, Omega_lle / (R * (T_C + 273.15)))
                        pa = antoine_p(T_C, antoine_A_A, antoine_A_B, antoine_A_C)
                        pb = antoine_p(T_C, antoine_B_A, antoine_B_B, antoine_B_C)
                        return x * gA * pa + (1.0 - x) * gB * pb - P_const
                    try:
                        T_sol = brentq(bubble_res, T_VLLE_C - 5, T_A_boil + 5)
                        T_bubble_2.append(T_sol)
                        gA, gB = activity_coeff(x, Omega_lle / (R * (T_sol + 273.15)))
                        pa = antoine_p(T_sol, antoine_A_A, antoine_A_B, antoine_A_C)
                        y_dew_2.append((x * gA * pa) / P_const)
                    except:
                        T_bubble_2.append(T_VLLE_C)
                        y_dew_2.append(y_VLLE)
                
                # Temperature slider
                T_min_plot = -10.0
                T_max_plot = max(T_A_boil, T_B_boil) + 15
                T_sys = st.slider("设定系统温度 T (°C)", min_value=float(T_min_plot), max_value=float(T_max_plot), value=float((T_VLLE_C + T_max_plot)/2.0), step=0.5)
                
                # Plotly Figure
                fig = go.Figure()
                
                # Add LLE curves
                fig.add_trace(go.Scatter(x=x1_lle, y=T_lle_grid, mode='lines', name='溶解度曲线 L1 (水相)', line=dict(color='#EF4444', width=2.5)))
                fig.add_trace(go.Scatter(x=x2_lle, y=T_lle_grid, mode='lines', name='溶解度曲线 L2 (有机相)', line=dict(color='#EF4444', width=2.5), showlegend=False))
                
                # Add VLLE horizontal tie line
                fig.add_trace(go.Scatter(x=[x1_vlle, x2_vlle], y=[T_VLLE_C, T_VLLE_C], mode='lines+markers', name='三相平衡线 (l1+l2+g)', line=dict(color='#B45309', width=3, dash='dash'), marker=dict(size=8, symbol='square')))
                
                # Add VLE Loop 1
                fig.add_trace(go.Scatter(x=x_grid_1, y=T_bubble_1, mode='lines', name='泡点线 (Bubble Point)', line=dict(color='#4F46E5', width=3)))
                fig.add_trace(go.Scatter(x=y_dew_1, y=T_bubble_1, mode='lines', name='露点线 (Dew Point)', line=dict(color='#06B6D4', width=2, dash='dash')))
                
                # Add VLE Loop 2
                fig.add_trace(go.Scatter(x=x_grid_2, y=T_bubble_2, mode='lines', name='泡点线 (Bubble Point)', line=dict(color='#4F46E5', width=3), showlegend=False))
                fig.add_trace(go.Scatter(x=y_dew_2, y=T_bubble_2, mode='lines', name='露点线 (Dew Point)', line=dict(color='#06B6D4', width=2, dash='dash'), showlegend=False))
                
                # UCST Marker
                fig.add_trace(go.Scatter(x=[0.5], y=[T_ucst - 273.15], mode='markers+text', name='会溶临界点 (UCST)', text=["UCST"], textposition="top center", marker=dict(color='#EF4444', size=10, symbol='circle')))
                
                # System state marker
                fig.add_trace(go.Scatter(x=[z_A], y=[T_sys], mode='markers', name='系统状态点', marker=dict(color='#10B981', size=12, symbol='diamond')))
                
                # Identify phase state and show message
                if T_sys < T_VLLE_C:
                    lle_t = get_lle_at_T(T_sys + 273.15)
                    if lle_t is not None:
                        x1_t, x2_t = lle_t
                        if z_A < x1_t:
                            st.success("👉 **单相液相区 (l1)**：温度低于三相线，系统为富含水 B 的均相液相 1。")
                        elif z_A > x2_t:
                            st.success("👉 **单相液相区 (l2)**：温度低于三相线，系统为富含有机物 A 的均相液相 2。")
                        else:
                            liq1_frac = (x2_t - z_A) / (x2_t - x1_t)
                            liq2_frac = 1.0 - liq1_frac
                            fig.add_trace(go.Scatter(x=[x1_t, x2_t], y=[T_sys, T_sys], mode='lines+markers', name='液液结线', line=dict(color='#EF4444', width=2)))
                            st.info(rf"""👉 **液液分层区 (l1 + l2)**：温度低于三相线，系统分层：
- 液相 1 组成 $x_{{A,1}} = {x1_t:.3f}$，摩尔分率 $f_{{L1}} = {liq1_frac*100:.1f}\%$
- 液相 2 组成 $x_{{A,2}} = {x2_t:.3f}$，摩尔分率 $f_{{L2}} = {liq2_frac*100:.1f}\%$
- 满足杠杆规则：$f_{{L1}} (z_A - x_{{A,1}}) = f_{{L2}} (x_{{A,2}} - z_A)$""")
                    else:
                        st.success("👉 **均相液相区 (L)**：温度高于液液会溶温度（UCST），液体完全互溶。")
                elif abs(T_sys - T_VLLE_C) < 0.2:
                    st.info(f"👉 **三相平衡区 (l1 + l2 + g)**：系统处于三相平衡温度 $T = {T_VLLE_C:.2f}$ °C。此时液相 1 ($x_1 = {x1_vlle:.3f}$)、液相 2 ($x_2 = {x2_vlle:.3f}$) 与气相 ($y = {y_VLLE:.3f}$) 三相平衡共存。自由度为 0。")
                else:
                    # T_sys > T_VLLE_C
                    # Interpolate bubble/dew compositions at T_sys
                    x_b1 = np.interp(T_sys, T_bubble_1[::-1], x_grid_1[::-1])
                    y_d1 = np.interp(T_sys, T_bubble_1[::-1], y_dew_1[::-1])
                    x_b2 = np.interp(T_sys, T_bubble_2, x_grid_2)
                    y_d2 = np.interp(T_sys, T_bubble_2, y_dew_2)
                    
                    if z_A < x_b1:
                        st.success("👉 **单相液相区 (l1)**：系统处于偏水侧均相液区。")
                    elif x_b1 <= z_A <= y_d1:
                        liq_frac = (y_d1 - z_A) / (y_d1 - x_b1)
                        fig.add_trace(go.Scatter(x=[x_b1, y_d1], y=[T_sys, T_sys], mode='lines+markers', name='气液结线', line=dict(color='#10B981', width=2)))
                        st.info(rf"""👉 **气液共存区 (l1 + g)**：系统为均相液体 1 与气相共存：
- 液相 1 组成 $x_A = {x_b1:.3f}$，摩尔分率 $f_L = {liq_frac*100:.1f}\%$
- 气相组成 $y_A = {y_d1:.3f}$，摩尔分率 $f_V = {(1.0-liq_frac)*100:.1f}\%$
- 满足杠杆规则""")
                    elif y_d1 < z_A < y_d2:
                        st.warning("👉 **单相气相区 (g)**：温度高于露点，系统完全呈气态。")
                    elif y_d2 <= z_A <= x_b2:
                        liq_frac = (x_b2 - z_A) / (x_b2 - y_d2)
                        fig.add_trace(go.Scatter(x=[y_d2, x_b2], y=[T_sys, T_sys], mode='lines+markers', name='气液结线', line=dict(color='#10B981', width=2)))
                        st.info(rf"""👉 **气液共存区 (l2 + g)**：系统为均相液体 2 与气相共存：
- 液相 2 组成 $x_A = {x_b2:.3f}$，摩尔分率 $f_L = {liq_frac*100:.1f}\%$
- 气相组成 $y_A = {y_d2:.3f}$，摩尔分率 $f_V = {(1.0-liq_frac)*100:.1f}\\%$
- 满足杠杆规则""")
                    else:
                        st.success("👉 **单相液相区 (l2)**：系统处于偏有机物侧均相液区。")
                
                fig.update_layout(
                    title=f"部分互溶双液系 恒压 T-x 相图 (p = {P_const} bar)",
                    xaxis_title="组分 A 的摩尔分数 (x_A, y_A)",
                    yaxis_title="温度 T (°C)",
                    xaxis=dict(range=[0, 1]),
                    hovermode="x unified",
                    legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01)
                )
                st.plotly_chart(fig, use_container_width=True)
                
        else:
            if diagram_type == "p-x 恒温图":
                p_A_star = antoine_p(T_const, antoine_A_A, antoine_A_B, antoine_A_C)
                p_B_star = antoine_p(T_const, antoine_B_A, antoine_B_B, antoine_B_C)
                
                x_grid = np.linspace(0, 1, 300)
                p_bubble = []
                y_A_arr = []
                
                lle = solve_lle(A_marg)
                
                if lle is not None:
                    x1, x2 = lle
                    g1, g2 = activity_coeff(x1, A_marg)
                    p_lle = x1 * g1 * p_A_star + (1.0 - x1) * g2 * p_B_star
                    y_lle = (x1 * g1 * p_A_star) / p_lle
                    
                    for x in x_grid:
                        if x < x1:
                            gA, gB = activity_coeff(x, A_marg)
                            pb = x * gA * p_A_star + (1.0 - x) * gB * p_B_star
                            yb = (x * gA * p_A_star) / pb
                        elif x > x2:
                            gA, gB = activity_coeff(x, A_marg)
                            pb = x * gA * p_A_star + (1.0 - x) * gB * p_B_star
                            yb = (x * gA * p_A_star) / pb
                        else:
                            pb = p_lle
                            yb = y_lle
                        p_bubble.append(pb)
                        y_A_arr.append(yb)
                else:
                    for x in x_grid:
                        gA, gB = activity_coeff(x, A_marg)
                        pb = x * gA * p_A_star + (1.0 - x) * gB * p_B_star
                        yb = (x * gA * p_A_star) / pb
                        p_bubble.append(pb)
                        y_A_arr.append(yb)
                
                p_bubble = np.array(p_bubble)
                y_A_arr = np.array(y_A_arr)
                
                # Check system state at z_A
                gA_z, gB_z = activity_coeff(z_A, A_marg)
                p_bubble_z = z_A * gA_z * p_A_star + (1.0 - z_A) * gB_z * p_B_star
                if lle is not None and x1 <= z_A <= x2:
                    p_bubble_z = p_lle
                
                # We also need a dew point pressure at z_A to set a reasonable slider default
                idx = np.argmin(np.abs(y_A_arr - z_A))
                p_dew_z = p_bubble[idx]
                
                st.write(f"在恒温 $T = {T_const:.1f}$ °C 下：")
                P_sys = st.slider("设定系统压力 P (bar)", min_value=float(np.min(p_bubble)*0.9), max_value=float(np.max(p_bubble)*1.2), value=float((p_bubble_z + p_dew_z)/2.0), step=0.01)
                
                # Find equilibrium crossings at P_sys
                x_eqs = []
                y_eqs = []
                
                if lle is None:
                    # Standard monotonic VLE
                    for i in range(len(x_grid)-1):
                        if (p_bubble[i] - P_sys) * (p_bubble[i+1] - P_sys) <= 0:
                            frac = (P_sys - p_bubble[i]) / (p_bubble[i+1] - p_bubble[i])
                            x_interp = x_grid[i] + frac * (x_grid[i+1] - x_grid[i])
                            y_interp = y_A_arr[i] + frac * (y_A_arr[i+1] - y_A_arr[i])
                            x_eqs.append(x_interp)
                            y_eqs.append(y_interp)
                else:
                    # LLE VLE overlap: search only stable liquid regions (x < x1 and x > x2)
                    # Left region (x < x1)
                    idx_left = np.where(x_grid < x1)[0]
                    for idx_i in range(len(idx_left)-1):
                        i = idx_left[idx_i]
                        if (p_bubble[i] - P_sys) * (p_bubble[i+1] - P_sys) <= 0 and p_bubble[i] != p_bubble[i+1]:
                            frac = (P_sys - p_bubble[i]) / (p_bubble[i+1] - p_bubble[i])
                            x_interp = x_grid[i] + frac * (x_grid[i+1] - x_grid[i])
                            y_interp = y_A_arr[i] + frac * (y_A_arr[i+1] - y_A_arr[i])
                            x_eqs.append(x_interp)
                            y_eqs.append(y_interp)
                            break
                    # Right region (x > x2)
                    idx_right = np.where(x_grid > x2)[0]
                    for idx_i in range(len(idx_right)-1):
                        i = idx_right[idx_i]
                        if (p_bubble[i] - P_sys) * (p_bubble[i+1] - P_sys) <= 0 and p_bubble[i] != p_bubble[i+1]:
                            frac = (P_sys - p_bubble[i]) / (p_bubble[i+1] - p_bubble[i])
                            x_interp = x_grid[i] + frac * (x_grid[i+1] - x_grid[i])
                            y_interp = y_A_arr[i] + frac * (y_A_arr[i+1] - y_A_arr[i])
                            x_eqs.append(x_interp)
                            y_eqs.append(y_interp)
                            break
                
                fig = go.Figure()
                fig.add_trace(go.Scatter(x=x_grid, y=p_bubble, mode='lines', name='液相线 (Bubble Point)', line=dict(color='#4F46E5', width=3)))
                fig.add_trace(go.Scatter(x=y_A_arr, y=p_bubble, mode='lines', name='气相线 (Dew Point)', line=dict(color='#06B6D4', width=3, dash='dash')))
                
                # Draw LLE region and boundaries
                if lle is not None:
                    P_max_plot = float(np.max(p_bubble)*1.2)
                    # 1. Shaded L1+L2 region only above p_lle
                    fig.add_trace(go.Scatter(
                        x=[x1, x2, x2, x1],
                        y=[p_lle, p_lle, P_max_plot, P_max_plot],
                        fill='toself',
                        fillcolor='rgba(239, 68, 68, 0.1)',
                        line=dict(color='rgba(239, 68, 68, 0.3)', width=1),
                        name='液相分层区 (l1 + l2)',
                        hoverinfo='skip'
                    ))
                    # 2. Three-phase equilibrium line
                    fig.add_trace(go.Scatter(
                        x=[x1, x2],
                        y=[p_lle, p_lle],
                        mode='lines+markers',
                        name='三相平衡线 (l1+l2+g)',
                        line=dict(color='#B45309', width=2.5, dash='dot'),
                        marker=dict(size=8, symbol='square')
                    ))
                    
                fig.add_trace(go.Scatter(x=[z_A], y=[P_sys], mode='markers', name='系统状态点', marker=dict(color='#10B981', size=12, symbol='diamond')))
                
                # Determine phase state and draw tie lines
                in_two_phase = False
                
                if lle is not None and P_sys > p_lle:
                    # Condensed liquid region: LLE or single liquid phase
                    if z_A < x1:
                        st.success("👉 **单相液相区 (l1)**：系统压力高于三相线，且组成较小，完全呈富含水 B 的液相 1。")
                    elif z_A > x2:
                        st.success("👉 **单相液相区 (l2)**：系统压力高于三相线，且组成较大，完全呈富含有机物 A 的液相 2。")
                    else:
                        in_two_phase = True
                        x_L_val, y_V_val = x1, x2
                        liq1_frac = (x2 - z_A) / (x2 - x1)
                        liq2_frac = 1.0 - liq1_frac
                        fig.add_trace(go.Scatter(x=[x1, x2], y=[P_sys, P_sys], mode='lines+markers', name='液液结线 (l1-l2)', line=dict(color='#EF4444', width=2)))
                        st.info(rf"""👉 **液液分层区 (l1 + l2)**：系统压力高于三相线，两液相共存：
- 液相 1 组成 $x_{{A,1}} = {x1:.3f}$，摩尔分率 $f_{{L1}} = {liq1_frac*100:.1f}\%$
- 液相 2 组成 $x_{{A,2}} = {x2:.3f}$，摩尔分率 $f_{{L2}} = {liq2_frac*100:.1f}\\%$
- 满足杠杆规则：$f_{{L1}} (z_A - x_{{A,1}}) = f_{{L2}} (x_{{A,2}} - z_A)$""")
                else:
                    # Gas-liquid region (P_sys <= p_lle) or standard VLE (lle is None)
                    # Check if z_A falls into any VLE two-phase region
                    x_L_val, y_V_val = None, None
                    if len(x_eqs) > 0:
                        for xl, yv in zip(x_eqs, y_eqs):
                            if (xl <= z_A <= yv) or (yv <= z_A <= xl):
                                in_two_phase = True
                                x_L_val = xl
                                y_V_val = yv
                                break
                    
                    if in_two_phase:
                        fig.add_trace(go.Scatter(x=[x_L_val, y_V_val], y=[P_sys, P_sys], mode='lines+markers', name='气液结线 (l-g)', line=dict(color='#10B981', width=2)))
                        liq_frac = abs(y_V_val - z_A) / abs(y_V_val - x_L_val)
                        vap_frac = 1.0 - liq_frac
                        st.info(rf"""👉 **气液共存区**：
- 液相组成 $x_A = {x_L_val:.3f}$，摩尔分率 $f_L = {liq_frac*100:.1f}\\%$
- 气相组成 $y_A = {y_V_val:.3f}$，摩尔分率 $f_V = {vap_frac*100:.1f}\\%$
- 满足杠杆规则""")
                    else:
                        if P_sys > p_bubble_z:
                            # Single-phase liquid
                            if lle is not None:
                                if z_A < x1:
                                    st.success("👉 **单相液相区 (l1)**：系统呈偏水侧均相液区。")
                                else:
                                    st.success("👉 **单相液相区 (l2)**：系统呈偏有机物侧均相液区。")
                            else:
                                st.success("👉 **单相液相区 (L)**：系统完全呈液态。")
                        else:
                            st.warning("👉 **单相气相区 (g)**：系统压力低于露点，完全呈气态。")
                
                fig.update_layout(
                    title=f"{name_A} - {name_B} 恒温 p-x 相图 (T = {T_const}°C)",
                    xaxis_title=f"组分 A 的摩尔分数 (x_A, y_A)",
                    yaxis_title="压力 p (bar)",
                    xaxis=dict(range=[0, 1]),
                    yaxis=dict(range=[0, float(np.max(p_bubble)*1.2)]),
                    hovermode="x unified",
                    legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01)
                )
                st.plotly_chart(fig, use_container_width=True)
                
            else:
                x_grid = np.linspace(1e-5, 1-1e-5, 200)
                T_bubble = []
                y_A_arr = []
                
                T_A_boil = antoine_T(P_const, antoine_A_A, antoine_A_B, antoine_A_C)
                T_B_boil = antoine_T(P_const, antoine_B_A, antoine_B_B, antoine_B_C)
                T_min = min(T_A_boil, T_B_boil) - 20
                T_max = max(T_A_boil, T_B_boil) + 20
                
                success = True
                for x in x_grid:
                    gA, gB = activity_coeff(x, A_marg)
                    def resid(T):
                        pa = antoine_p(T, antoine_A_A, antoine_A_B, antoine_A_C)
                        pb = antoine_p(T, antoine_B_A, antoine_B_B, antoine_B_C)
                        return x * gA * pa + (1.0 - x) * gB * pb - P_const
                    
                    try:
                        T_sol = brentq(resid, T_min, T_max)
                        T_bubble.append(T_sol)
                        pa = antoine_p(T_sol, antoine_A_A, antoine_A_B, antoine_A_C)
                        y_A_arr.append((x * gA * pa) / P_const)
                    except ValueError:
                        try:
                            T_sol = brentq(resid, T_min - 50, T_max + 50)
                            T_bubble.append(T_sol)
                            pa = antoine_p(T_sol, antoine_A_A, antoine_A_B, antoine_A_C)
                            y_A_arr.append((x * gA * pa) / P_const)
                        except:
                            success = False
                            break
                            
                if not success:
                    st.error("数值求解温度曲线失败，请调整 Antoine 常数或压力值。")
                else:
                    T_bubble = np.array(T_bubble)
                    y_A_arr = np.array(y_A_arr)
                    
                    idx_z = np.argmin(np.abs(x_grid - z_A))
                    T_bubble_z = T_bubble[idx_z]
                    
                    idx_y_z = np.argmin(np.abs(y_A_arr - z_A))
                    T_dew_z = T_bubble[idx_y_z]
                    
                    st.write(f"在恒压 $p = {P_const:.3f}$ bar 下：")
                    T_sys = st.slider("设定系统温度 T (°C)", min_value=float(np.min(T_bubble)-5), max_value=float(np.max(T_bubble)+5), value=float((T_bubble_z + T_dew_z)/2.0), step=0.5)
                    
                    x_eqs = []
                    y_eqs = []
                    for i in range(len(x_grid)-1):
                        if (T_bubble[i] - T_sys) * (T_bubble[i+1] - T_sys) <= 0:
                            frac = (T_sys - T_bubble[i]) / (T_bubble[i+1] - T_bubble[i])
                            x_interp = x_grid[i] + frac * (x_grid[i+1] - x_grid[i])
                            y_interp = y_A_arr[i] + frac * (y_A_arr[i+1] - y_A_arr[i])
                            x_eqs.append(x_interp)
                            y_eqs.append(y_interp)
                    
                    fig = go.Figure()
                    fig.add_trace(go.Scatter(x=x_grid, y=T_bubble, mode='lines', name='液相线 (Bubble Point)', line=dict(color='#4F46E5', width=3)))
                    fig.add_trace(go.Scatter(x=y_A_arr, y=T_bubble, mode='lines', name='气相线 (Dew Point)', line=dict(color='#06B6D4', width=3, dash='dash')))
                    
                    fig.add_trace(go.Scatter(x=[z_A], y=[T_sys], mode='markers', name='系统状态点', marker=dict(color='#10B981', size=12, symbol='diamond')))
                    
                    in_two_phase = False
                    x_L_val, y_V_val = None, None
                    for xl, yv in zip(x_eqs, y_eqs):
                        if (xl <= z_A <= yv) or (yv <= z_A <= xl):
                            in_two_phase = True
                            x_L_val = xl
                            y_V_val = yv
                            break
                    
                    if in_two_phase:
                        fig.add_trace(go.Scatter(x=[x_L_val, y_V_val], y=[T_sys, T_sys], mode='lines+markers', name='结线 (Tie Line)', line=dict(color='#10B981', width=2)))
                        liq_frac = abs(y_V_val - z_A) / abs(y_V_val - x_L_val)
                        vap_frac = 1.0 - liq_frac
                        st.info(rf"""👉 **双相区** (气液共存)：
- 液相组成 $x_A = {x_L_val:.3f}$，摩尔分率 $f_L = {liq_frac*100:.1f}\%$
- 气相组成 $y_A = {y_V_val:.3f}$，摩尔分率 $f_V = {vap_frac*100:.1f}\\%$
- 满足杠杆规则：$f_L (z_A - x_A) = f_V (y_A - z_A)$""")
                    else:
                        if T_sys < T_bubble_z:
                            st.success("👉 **单相液相区**：系统温度低于泡点，完全呈液态。")
                        else:
                            st.warning("👉 **单相气相区**：系统温度高于露点，完全呈气态。")
                    
                    fig.update_layout(
                        title=f"{name_A} - {name_B} 恒压 T-x 相图 (p = {P_const} bar)",
                        xaxis_title=f"组分 A 的摩尔分数 (x_A, y_A)",
                        yaxis_title="温度 T (°C)",
                        xaxis=dict(range=[0, 1]),
                        hovermode="x unified",
                        legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01)
                    )
                    st.plotly_chart(fig, use_container_width=True)

        st.markdown('</div>', unsafe_allow_html=True)

# ====================================================
# TAB 2: BINARY SLE (固液平衡)
# ====================================================
with tab2:
    st.markdown('<div class="card-header">二元固液平衡相图 (SLE)</div>', unsafe_allow_html=True)
    
    col_sle_ctrl, col_sle_plot = st.columns([1, 2])
    
    with col_sle_ctrl:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        st.subheader("💡 固液相图参数设置")
        
        sle_type = st.radio("固液体系类型", ["生成完全互溶固溶体", "简单低共熔体系 (无固溶体)"])
        
        if sle_type == "生成完全互溶固溶体":
            default_TA = 1356.0
            default_TB = 1728.0
            default_H_fus_A = 13000.0
            default_H_fus_B = 17500.0
            title_suffix = "(类似 Cu-Ni 完全互溶固溶体)"
        else:
            default_TA = 600.0
            default_TB = 500.0
            default_H_fus_A = 12000.0
            default_H_fus_B = 10000.0
            title_suffix = "(简单低共熔体系)"
            
        T_A_melt = st.number_input("A 的熔点 T_A* (K)", value=default_TA, step=10.0)
        T_B_melt = st.number_input("B 的熔点 T_B* (K)", value=default_TB, step=10.0)
        
        H_fus_A = st.number_input("A 的摩尔熔化焓 Δfus H_A (J/mol)", value=default_H_fus_A, step=500.0)
        H_fus_B = st.number_input("B 的摩尔熔化焓 Δfus H_B (J/mol)", value=default_H_fus_B, step=500.0)
        
        z_A_sle = st.slider("系统总组成 z_A (摩尔分数)", min_value=0.0, max_value=1.0, value=0.5, step=0.01, key="z_a_sle")
        
        min_T_plot = min(T_A_melt, T_B_melt) - 150
        max_T_plot = max(T_A_melt, T_B_melt) + 50
        
        T_sys_sle = st.slider("系统温度 T (K)", min_value=float(min_T_plot), max_value=float(max_T_plot), value=float((T_A_melt+T_B_melt)/2.0), step=1.0)
        
        st.markdown('</div>', unsafe_allow_html=True)
        
    with col_sle_plot:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        
        fig = go.Figure()
        
        if sle_type == "生成完全互溶固溶体":
            T_min_m = min(T_A_melt, T_B_melt)
            T_max_m = max(T_A_melt, T_B_melt)
            T_grid = np.linspace(T_min_m + 0.01, T_max_m - 0.01, 200)
            
            x_liq = []
            x_sol = []
            
            for T in T_grid:
                lamA = np.exp((H_fus_A / R) * (1.0 / T - 1.0 / T_A_melt))
                lamB = np.exp((H_fus_B / R) * (1.0 / T - 1.0 / T_B_melt))
                
                xl = lamA * (lamB - 1.0) / (lamB - lamA)
                xs = (lamB - 1.0) / (lamB - lamA)
                
                x_liq.append(xl)
                x_sol.append(xs)
                
            x_liq = np.array(x_liq)
            x_sol = np.array(x_sol)
            
            all_T = np.concatenate([[T_min_m], T_grid, [T_max_m]])
            if T_A_melt > T_B_melt:
                all_x_liq = np.concatenate([[0.0], x_liq, [1.0]])
                all_x_sol = np.concatenate([[0.0], x_sol, [1.0]])
            else:
                all_x_liq = np.concatenate([[1.0], x_liq, [0.0]])
                all_x_sol = np.concatenate([[1.0], x_sol, [0.0]])
                
            sort_liq = np.argsort(all_x_liq)
            sort_sol = np.argsort(all_x_sol)
            
            fig.add_trace(go.Scatter(x=all_x_liq[sort_liq], y=all_T[sort_liq], mode='lines', name='液相线 (Liquidus)', line=dict(color='#4F46E5', width=3)))
            fig.add_trace(go.Scatter(x=all_x_sol[sort_sol], y=all_T[sort_sol], mode='lines', name='固相线 (Solidus)', line=dict(color='#10B981', width=3, dash='dash')))
            
            if T_sys_sle >= T_max_m:
                st.success("👉 **单相液相区 (Liquid)**：系统完全熔化。")
            elif T_sys_sle <= T_min_m:
                st.info("👉 **单相固相区 (Solid Solution)**：系统完全结晶为固溶体。")
            else:
                lamA_sys = np.exp((H_fus_A / R) * (1.0 / T_sys_sle - 1.0 / T_A_melt))
                lamB_sys = np.exp((H_fus_B / R) * (1.0 / T_sys_sle - 1.0 / T_B_melt))
                x_L = lamA_sys * (lamB_sys - 1.0) / (lamB_sys - lamA_sys)
                x_S = (lamB_sys - 1.0) / (lamB_sys - lamA_sys)
                
                min_x = min(x_L, x_S)
                max_x = max(x_L, x_S)
                
                if min_x <= z_A_sle <= max_x:
                    fig.add_trace(go.Scatter(x=[x_L, x_S], y=[T_sys_sle, T_sys_sle], mode='lines+markers', name='结线 (Tie Line)', line=dict(color='#EAB308', width=2)))
                    liq_frac = abs(x_S - z_A_sle) / abs(x_S - x_L)
                    sol_frac = 1.0 - liq_frac
                    st.warning(rf"""👉 **两相共存区 (Liquid + Solid Solution)**：
- 液相组成 $x_A = {x_L:.3f}$，质量/摩尔分率 $f_L = {liq_frac*100:.1f}\%$
- 固相组成 $x_{{A,\text{{solid}}}} = {x_S:.3f}$，质量/摩尔分率 $f_S = {sol_frac*100:.1f}\%$
- 遵循固液平衡方程 (10) 和 (11)。""")
                elif (x_L < x_S and z_A_sle < x_L) or (x_L > x_S and z_A_sle > x_L):
                    st.success("👉 **单相液相区 (Liquid)**：系统呈液态。")
                else:
                    st.info("👉 **单相固相区 (Solid Solution)**：系统呈固溶体状态。")
                    
        else:
            def eutectic_resid(x):
                T_A = 1.0 / (1.0 / T_A_melt - (R / H_fus_A) * np.log(x))
                T_B = 1.0 / (1.0 / T_B_melt - (R / H_fus_B) * np.log(1.0 - x))
                return T_A - T_B
                
            x_E = brentq(eutectic_resid, 1e-6, 1.0 - 1e-6)
            T_E = 1.0 / (1.0 / T_A_melt - (R / H_fus_A) * np.log(x_E))
            
            x_grid_A = np.linspace(x_E, 1.0, 100)
            T_liq_A = 1.0 / (1.0 / T_A_melt - (R / H_fus_A) * np.log(x_grid_A))
            
            x_grid_B = np.linspace(1e-6, x_E, 100)
            T_liq_B = 1.0 / (1.0 / T_B_melt - (R / H_fus_B) * np.log(1.0 - x_grid_B))
            
            fig.add_trace(go.Scatter(x=x_grid_B, y=T_liq_B, mode='lines', name='液相线 (Liquidus L+B)', line=dict(color='#4F46E5', width=3)))
            fig.add_trace(go.Scatter(x=x_grid_A, y=T_liq_A, mode='lines', name='液相线 (Liquidus L+A)', line=dict(color='#4F46E5', width=3), showlegend=False))
            fig.add_trace(go.Scatter(x=[0, 1], y=[T_E, T_E], mode='lines', name=f'共晶温度线 (T_E = {T_E:.1f} K)', line=dict(color='#EF4444', width=2, dash='dot')))
            fig.add_trace(go.Scatter(x=[x_E], y=[T_E], mode='markers', name='共晶点 (Eutectic)', marker=dict(color='#EF4444', size=10, symbol='x')))
            
            if T_sys_sle >= T_E:
                if T_sys_sle < T_A_melt:
                    x_L_A = np.exp((H_fus_A / R) * (1.0 / T_A_melt - 1.0 / T_sys_sle))
                else:
                    x_L_A = 1.0
                    
                if T_sys_sle < T_B_melt:
                    x_L_B = 1.0 - np.exp((H_fus_B / R) * (1.0 / T_B_melt - 1.0 / T_sys_sle))
                else:
                    x_L_B = 0.0
                    
                if x_L_B <= z_A_sle <= x_L_A:
                    st.success("👉 **单相液相区 (Liquid)**：系统完全处于液态。")
                elif z_A_sle > x_L_A:
                    fig.add_trace(go.Scatter(x=[x_L_A, 1.0], y=[T_sys_sle, T_sys_sle], mode='lines+markers', name='结线 (Tie Line)', line=dict(color='#EAB308', width=2)))
                    liq_frac = (1.0 - z_A_sle) / (1.0 - x_L_A)
                    sol_frac = 1.0 - liq_frac
                    st.warning(rf"""👉 **液相 + 纯固体 A 共存区**：
- 液相组成 $x_A = {x_L_A:.3f}$，分率 $f_L = {liq_frac*100:.1f}\%$
- 固相为 **纯固体 A**，分率 $f_{{\text{{solid A}}}} = {sol_frac*100:.1f}\%$""")
                else:
                    fig.add_trace(go.Scatter(x=[x_L_B, 0.0], y=[T_sys_sle, T_sys_sle], mode='lines+markers', name='结线 (Tie Line)', line=dict(color='#EAB308', width=2)))
                    liq_frac = z_A_sle / x_L_B
                    sol_frac = 1.0 - liq_frac
                    st.warning(rf"""👉 **液相 + 纯固体 B 共存区**：
- 液相组成 $x_A = {x_L_B:.3f}$，分率 $f_L = {liq_frac*100:.1f}\\%$
- 固相为 **纯固体 B**，分率 $f_{{\text{{solid B}}}} = {sol_frac*100:.1f}\\%$""")
            else:
                fig.add_trace(go.Scatter(x=[0.0, 1.0], y=[T_sys_sle, T_sys_sle], mode='lines+markers', name='结线 (Tie Line)', line=dict(color='#EAB308', width=2)))
                sol_A_frac = z_A_sle
                sol_B_frac = 1.0 - z_A_sle
                st.info(rf"""👉 **机械混合物固相区 (Solid A + Solid B)**：温度低于共晶温度。
- 混合物由 **纯固体 A** (${sol_A_frac*100:.1f}\%$) and **纯固体 B** (${sol_B_frac*100:.1f}\%$) 组成。
- 满足凝固点降低公式 (13) and (14)。""")
            
        fig.add_trace(go.Scatter(x=[z_A_sle], y=[T_sys_sle], mode='markers', name='系统状态点', marker=dict(color='#10B981', size=12, symbol='diamond')))
        
        fig.update_layout(
            title=f"二元 SLE T-x 固液相图 {title_suffix}",
            xaxis_title="组分 A 的摩尔分数 (x_A)",
            yaxis_title="温度 T (K)",
            xaxis=dict(range=[0, 1]),
            hovermode="x unified",
            legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01)
        )
        st.plotly_chart(fig, use_container_width=True)

        st.markdown('</div>', unsafe_allow_html=True)
# ====================================================
# TAB 3: TERNARY SYSTEM & CRYSTALLIZATION SIMULATOR
# ====================================================
with tab3:
    st.markdown('<div class="card-header">三元体系 H₂O - KNO₃ - NaNO₃ 相图与工业分盐模拟</div>', unsafe_allow_html=True)
    
    M_B = 101.102
    M_C = 84.9947
    
    def get_ksp(T_K):
        T1 = 298.15
        T2 = 373.15
        
        mB1 = (36.0 / M_B) * 10.0
        mC1 = (91.2 / M_C) * 10.0
        
        mB2 = (247.0 / M_B) * 10.0
        mC2 = (180.0 / M_C) * 10.0
        
        ksp_B1 = mB1 * mB1
        ksp_C1 = mC1 * mC1
        ksp_B2 = mB2 * mB2
        ksp_C2 = mC2 * mC2
        
        inv_T = 1.0 / T_K
        inv_T1 = 1.0 / T1
        inv_T2 = 1.0 / T2
        
        frac = (inv_T - inv_T1) / (inv_T2 - inv_T1)
        
        ln_ksp_B = np.log(ksp_B1) + frac * (np.log(ksp_B2) - np.log(ksp_B1))
        ln_ksp_C = np.log(ksp_C1) + frac * (np.log(ksp_C2) - np.log(ksp_C1))
        
        return np.exp(ln_ksp_B), np.exp(ln_ksp_C)
        
    def solve_ternary_equilibrium(T_K, m_A, m_B, m_C):
        ksp_B, ksp_C = get_ksp(T_K)
        
        if m_A <= 1e-4:
            return {
                'liq_water': 0.0, 'liq_B': 0.0, 'liq_C': 0.0,
                'sol_B': m_B, 'sol_C': m_C,
                'x_A': 0.0, 'x_B': 0.0, 'x_C': 0.0,
                'state': '完全固体 (无水)'
            }
            
        mB_overall = (m_B / M_B) / (m_A / 1000.0)
        mC_overall = (m_C / M_C) / (m_A / 1000.0)
        
        r = ksp_B / ksp_C
        mC_D = np.sqrt(ksp_C / (r + 1.0))
        mB_D = r * mC_D
        
        if mB_overall * (mB_overall + mC_overall) <= ksp_B and mC_overall * (mB_overall + mC_overall) <= ksp_C:
            return {
                'liq_water': m_A, 'liq_B': m_B, 'liq_C': m_C,
                'sol_B': 0.0, 'sol_C': 0.0,
                'x_A': m_A / (m_A + m_B + m_C),
                'x_B': m_B / (m_A + m_B + m_C),
                'x_C': m_C / (m_A + m_B + m_C),
                'state': '不饱和溶液'
            }
            
        mC_L = mC_overall
        mB_L = (-mC_L + np.sqrt(mC_L**2 + 4.0 * ksp_B)) / 2.0
        if mB_L <= mB_overall:
            if mC_L * (mB_L + mC_L) <= ksp_C:
                liq_B_g = mB_L * (m_A / 1000.0) * M_B
                sol_B_g = m_B - liq_B_g
                liq_mass = m_A + liq_B_g + m_C
                return {
                    'liq_water': m_A, 'liq_B': liq_B_g, 'liq_C': m_C,
                    'sol_B': sol_B_g, 'sol_C': 0.0,
                    'x_A': m_A / liq_mass,
                    'x_B': liq_B_g / liq_mass,
                    'x_C': m_C / liq_mass,
                    'state': f'KNO₃ 饱和 (析出 KNO₃ {sol_B_g:.1f} g)'
                }
                
        mB_L = mB_overall
        mC_L = (-mB_L + np.sqrt(mB_L**2 + 4.0 * ksp_C)) / 2.0
        if mC_L <= mC_overall:
            if mB_L * (mB_L + mC_L) <= ksp_B:
                liq_C_g = mC_L * (m_A / 1000.0) * M_C
                sol_C_g = m_C - liq_C_g
                liq_mass = m_A + m_B + liq_C_g
                return {
                    'liq_water': m_A, 'liq_B': m_B, 'liq_C': liq_C_g,
                    'sol_B': 0.0, 'sol_C': sol_C_g,
                    'x_A': m_A / liq_mass,
                    'x_B': m_B / liq_mass,
                    'x_C': liq_C_g / liq_mass,
                    'state': f'NaNO₃ 饱和 (析出 NaNO₃ {sol_C_g:.1f} g)'
                }
                
        sol_B_g = m_B - mB_D * (m_A / 1000.0) * M_B
        sol_C_g = m_C - mC_D * (m_A / 1000.0) * M_C
        
        sol_B_g = max(0.0, sol_B_g)
        sol_C_g = max(0.0, sol_C_g)
        
        liq_B_g = mB_D * (m_A / 1000.0) * M_B
        liq_C_g = mC_D * (m_A / 1000.0) * M_C
        liq_mass = m_A + liq_B_g + liq_C_g
        
        return {
            'liq_water': m_A, 'liq_B': liq_B_g, 'liq_C': liq_C_g,
            'sol_B': sol_B_g, 'sol_C': sol_C_g,
            'x_A': m_A / liq_mass,
            'x_B': liq_B_g / liq_mass,
            'x_C': liq_C_g / liq_mass,
            'state': f'双饱和区 (析出 KNO₃: {sol_B_g:.1f} g, NaNO₃: {sol_C_g:.1f} g)'
        }

    def generate_isotherm(T_K, resolution=100):
        ksp_B, ksp_C = get_ksp(T_K)
        r = ksp_B / ksp_C
        mC_D = np.sqrt(ksp_C / (r + 1.0))
        mB_D = r * mC_D
        
        m_C_vals = np.linspace(0, mC_D, resolution)
        x_A_curve1 = []
        x_B_curve1 = []
        x_C_curve1 = []
        
        for mc in m_C_vals:
            mb = (-mc + np.sqrt(mc**2 + 4.0 * ksp_B)) / 2.0
            tot = 1000.0 + mb * M_B + mc * M_C
            x_A_curve1.append(1000.0 / tot)
            x_B_curve1.append(mb * M_B / tot)
            x_C_curve1.append(mc * M_C / tot)
            
        m_B_vals = np.linspace(0, mB_D, resolution)
        x_A_curve2 = []
        x_B_curve2 = []
        x_C_curve2 = []
        
        for mb in m_B_vals:
            mc = (-mb + np.sqrt(mb**2 + 4.0 * ksp_C)) / 2.0
            tot = 1000.0 + mb * M_B + mc * M_C
            x_A_curve2.append(1000.0 / tot)
            x_B_curve2.append(mb * M_B / tot)
            x_C_curve2.append(mc * M_C / tot)
            
        return {
            'A': np.concatenate([x_A_curve1, x_A_curve2[::-1]]),
            'B': np.concatenate([x_B_curve1, x_B_curve2[::-1]]),
            'C': np.concatenate([x_C_curve1, x_C_curve2[::-1]]),
            'D': (1000.0/(1000.0+mB_D*M_B+mC_D*M_C), mB_D*M_B/(1000.0+mB_D*M_B+mC_D*M_C), mC_D*M_C/(1000.0+mB_D*M_B+mC_D*M_C))
        }

    if 'history' not in st.session_state:
        st.session_state.history = []
        
    def add_step(name, T_C, m_A, m_B, m_C, comment=""):
        eq = solve_ternary_equilibrium(T_C + 273.15, m_A, m_B, m_C)
        
        tot = m_A + m_B + m_C
        w_A = m_A / tot if tot > 0 else 0
        w_B = m_B / tot if tot > 0 else 0
        w_C = m_C / tot if tot > 0 else 0
        
        st.session_state.history.append({
            'Step': len(st.session_state.history) + 1,
            'Operation': name,
            'Temp_C': T_C,
            'm_H2O': m_A,
            'm_KNO3_tot': m_B,
            'm_NaNO3_tot': m_C,
            'w_H2O': w_A,
            'w_KNO3': w_B,
            'w_NaNO3': w_C,
            'State': eq['state'],
            'liq_water': eq['liq_water'],
            'liq_B': eq['liq_B'],
            'liq_C': eq['liq_C'],
            'liq_w_KNO3': eq['liq_B'] / (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) if (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) > 0 else 0,
            'liq_w_NaNO3': eq['liq_C'] / (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) if (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) > 0 else 0,
            'liq_w_H2O': eq['liq_water'] / (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) if (eq['liq_water'] + eq['liq_B'] + eq['liq_C']) > 0 else 0,
            'sol_KNO3': eq['sol_B'],
            'sol_NaNO3': eq['sol_C'],
            'comment': comment
        })

    col_tern_ctrl, col_tern_plot = st.columns([2, 3])
    
    with col_tern_ctrl:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        st.subheader("🛠️ 工艺流程操作台")
        
        c1, c2 = st.columns(2)
        with c1:
            feed_kno3 = st.number_input("初始 KNO₃ 质量 (g)", value=100.0, step=10.0)
            feed_nano3 = st.number_input("初始 NaNO₃ 质量 (g)", value=100.0, step=10.0)
            feed_water = st.number_input("初始 H₂O 质量 (g)", value=100.0, step=10.0)
        with c2:
            op_temp = st.slider("操作温度 (°C)", min_value=25.0, max_value=100.0, value=100.0, step=5.0, key="op_temp")
            
        col_btn1, col_btn2 = st.columns(2)
        with col_btn1:
            if st.button("📥 初始化进料", use_container_width=True):
                st.session_state.history = []
                add_step("初始进料", op_temp, feed_water, feed_kno3, feed_nano3, "向反应器中加入原料")
                st.success("进料初始化成功！")
        with col_btn2:
            if st.button("🔄 重置流程", use_container_width=True):
                st.session_state.history = []
                st.rerun()
                
        st.write("---")
        st.markdown("**➕ 添加下一步操作：**")
        
        if len(st.session_state.history) > 0:
            last = st.session_state.history[-1]
            
            op_type = st.selectbox(
                "选择物理操作",
                ["加热/冷却", "等温蒸发水", "等温加水", "过滤分离晶体"]
            )
            
            if op_type == "加热/冷却":
                new_temp = st.slider("新温度 (°C)", min_value=25.0, max_value=100.0, value=25.0, step=5.0, key="new_temp")
                if st.button("执行变温", use_container_width=True):
                    add_step(f"变温至 {new_temp}°C", new_temp, last['m_H2O'], last['m_KNO3_tot'], last['m_NaNO3_tot'], f"改变系统温度到 {new_temp}°C")
                    st.rerun()
                    
            elif op_type == "等温蒸发水":
                evap_w = st.number_input("蒸发水量 (g)", min_value=0.0, max_value=float(last['m_H2O']), value=min(20.0, float(last['m_H2O'])), step=5.0)
                if st.button("执行蒸发", use_container_width=True):
                    new_w = last['m_H2O'] - evap_w
                    add_step(f"等温蒸发 {evap_w}g 水", last['Temp_C'], new_w, last['m_KNO3_tot'], last['m_NaNO3_tot'], f"在 {last['Temp_C']}°C 下蒸发水分")
                    st.rerun()
                    
            elif op_type == "等温加水":
                add_w = st.number_input("加入水量 (g)", min_value=0.0, value=20.0, step=5.0)
                if st.button("执行加水", use_container_width=True):
                    new_w = last['m_H2O'] + add_w
                    add_step(f"加入 {add_w}g 水", last['Temp_C'], new_w, last['m_KNO3_tot'], last['m_NaNO3_tot'], f"在 {last['Temp_C']}°C 下稀释")
                    st.rerun()
                    
            elif op_type == "过滤分离晶体":
                if st.button("过滤分离固体晶体", use_container_width=True):
                    kno3_h = last['sol_KNO3']
                    nano3_h = last['sol_NaNO3']
                    
                    add_step(
                        "过滤固液分离", 
                        last['Temp_C'], 
                        last['liq_water'], 
                        last['liq_B'], 
                        last['liq_C'], 
                        f"过滤收获固体晶体：KNO₃ = {kno3_h:.1f}g, NaNO₃ = {nano3_h:.1f}g"
                    )
                    st.success(f"已过滤！收获 KNO₃ {kno3_h:.1f} g, NaNO₃ {nano3_h:.1f} g")
                    st.rerun()
        else:
            st.info("请先点击 '📥 初始化进料' 开始模拟。")
            
        st.write("---")
        if st.button("🎓 载入教科书经典分离 KNO₃ 与 NaNO₃ 案例 (课后题21)", use_container_width=True):
            st.session_state.history = []
            add_step("初始混合物", 100.0, 100.0, 100.0, 100.0, "100g KNO3 + 100g NaNO3 + 100g H2O @ 100°C")
            add_step("冷却至 25°C", 25.0, 100.0, 100.0, 100.0, "降温使得 KNO₃ 结晶析出，而 NaNO₃ 依然留在溶液中")
            
            last = st.session_state.history[-1]
            add_step("常温过滤", 25.0, last['liq_water'], last['liq_B'], last['liq_C'], f"分离出纯 KNO₃ 固体 {last['sol_KNO3']:.1f} g")
            
            last = st.session_state.history[-1]
            add_step("高温加热并蒸发 60g 水", 100.0, last['m_H2O'] - 60.0, last['m_KNO3_tot'], last['m_NaNO3_tot'], "在 100°C 下蒸发水分促使 NaNO₃ 结晶析出")
            
            last = st.session_state.history[-1]
            add_step("高温过滤", 100.0, last['liq_water'], last['liq_B'], last['liq_C'], f"在 100°C 过滤分出 NaNO₃ 固体 {last['sol_NaNO3']:.1f} g")
            
            st.success("成功载入经典分离案例！请看右侧相图的移动轨迹。")
            st.rerun()

        st.markdown('</div>', unsafe_allow_html=True)
        
    with col_tern_plot:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        
        fig_tern = go.Figure()
        
        iso_25 = generate_isotherm(298.15)
        fig_tern.add_trace(go.Scatterternary(
            a=iso_25['A'], b=iso_25['B'], c=iso_25['C'],
            mode='lines',
            name='25°C 溶解度曲线 (EDF)',
            line=dict(color='#4F46E5', width=3)
        ))
        fig_tern.add_trace(go.Scatterternary(
            a=[iso_25['D'][0]], b=[iso_25['D'][1]], c=[iso_25['D'][2]],
            mode='markers+text',
            name='25°C 共饱点 D',
            text=['D (25°C)'], textposition='top center',
            marker=dict(color='#4F46E5', size=10, symbol='circle')
        ))
        
        iso_100 = generate_isotherm(373.15)
        fig_tern.add_trace(go.Scatterternary(
            a=iso_100['A'], b=iso_100['B'], c=iso_100['C'],
            mode='lines',
            name='100°C 溶解度曲线 (E\'D\'F\')',
            line=dict(color='#06B6D4', width=3, dash='dash')
        ))
        fig_tern.add_trace(go.Scatterternary(
            a=[iso_100['D'][0]], b=[iso_100['D'][1]], c=[iso_100['D'][2]],
            mode='markers+text',
            name='100°C 共饱点 D\'',
            text=['D\' (100°C)'], textposition='bottom center',
            marker=dict(color='#06B6D4', size=10, symbol='circle')
        ))
        
        if len(st.session_state.history) > 0:
            path_A = [step['w_H2O'] for step in st.session_state.history]
            path_B = [step['w_KNO3'] for step in st.session_state.history]
            path_C = [step['w_NaNO3'] for step in st.session_state.history]
            labels = [f"步骤 {step['Step']}: {step['Operation']}<br>T={step['Temp_C']}°C" for step in st.session_state.history]
            
            fig_tern.add_trace(go.Scatterternary(
                a=path_A, b=path_B, c=path_C,
                mode='lines+markers+text',
                name='系统状态运行轨迹',
                text=[f"{step['Step']}" for step in st.session_state.history],
                textposition='middle right',
                hoverinfo='text',
                hovertext=labels,
                marker=dict(color='#F59E0B', size=10, symbol='diamond'),
                line=dict(color='#F59E0B', width=3)
            ))
            
            liq_A = [step['liq_w_H2O'] for step in st.session_state.history]
            liq_B = [step['liq_w_KNO3'] for step in st.session_state.history]
            liq_C = [step['liq_w_NaNO3'] for step in st.session_state.history]
            
            fig_tern.add_trace(go.Scatterternary(
                a=liq_A, b=liq_B, c=liq_C,
                mode='markers',
                name='液相平衡点 (母液/滤液)',
                hoverinfo='text',
                hovertext=[f"步骤 {step['Step']} 平衡液相组成:<br>H2O={step['liq_w_H2O']*100:.1f}%<br>KNO3={step['liq_w_KNO3']*100:.1f}%<br>NaNO3={step['liq_w_NaNO3']*100:.1f}%" for step in st.session_state.history],
                marker=dict(color='#10B981', size=8, symbol='circle-open-dot'),
            ))
            
        fig_tern.update_layout(
            title="H₂O - KNO₃ - NaNO₃ 三元液固平衡相图 (质量分数 %)",
            ternary=dict(
                sum=1.0,
                aaxis=dict(title='H₂O (A) (顶)', titlefont=dict(size=14)),
                baxis=dict(title='KNO₃ (B) (左底)', titlefont=dict(size=14)),
                caxis=dict(title='NaNO₃ (C) (右底)', titlefont=dict(size=14))
            ),
            legend=dict(yanchor="top", y=0.95, xanchor="left", x=0.01),
            margin=dict(l=20, r=20, t=40, b=20)
        )
        st.plotly_chart(fig_tern, use_container_width=True)
        
        st.markdown('</div>', unsafe_allow_html=True)

    if len(st.session_state.history) > 0:
        st.markdown('<div class="premium-card">', unsafe_allow_html=True)
        st.subheader("📋 工艺流程运行历史与物料衡算表")
        
        df_hist = pd.DataFrame(st.session_state.history)
        
        show_cols = {
            'Step': '步骤',
            'Operation': '操作类型',
            'Temp_C': '温度 (°C)',
            'm_H2O': '体系总水量 (g)',
            'm_KNO3_tot': '体系总 KNO₃ (g)',
            'm_NaNO3_tot': '体系总 NaNO₃ (g)',
            'State': '相平衡状态',
            'sol_KNO3': '析出 KNO₃ 晶体 (g)',
            'sol_NaNO3': '析出 NaNO₃ 晶体 (g)',
            'comment': '详细说明'
        }
        
        df_display = df_hist[show_cols.keys()].rename(columns=show_cols)
        df_display['体系总水量 (g)'] = df_display['体系总水量 (g)'].round(1)
        df_display['体系总 KNO₃ (g)'] = df_display['体系总 KNO₃ (g)'].round(1)
        df_display['体系总 NaNO₃ (g)'] = df_display['体系总 NaNO₃ (g)'].round(1)
        df_display['析出 KNO₃ 晶体 (g)'] = df_display['析出 KNO₃ 晶体 (g)'].round(1)
        df_display['析出 NaNO₃ 晶体 (g)'] = df_display['析出 NaNO₃ 晶体 (g)'].round(1)
        
        st.dataframe(df_display, use_container_width=True, hide_index=True)
        
        st.markdown("### 🔍 分离效果分析评估")
        kno3_harvested = 0.0
        nano3_harvested = 0.0
        for i, step in enumerate(st.session_state.history):
            if "过滤" in step['Operation'] or "分离" in step['Operation']:
                prev_step = st.session_state.history[i-1]
                if "25°C" in prev_step['Operation'] or prev_step['Temp_C'] == 25.0:
                    kno3_harvested += prev_step['sol_KNO3']
                    nano3_harvested += prev_step['sol_NaNO3']
                elif "100°C" in prev_step['Operation'] or prev_step['Temp_C'] == 100.0:
                    kno3_harvested += prev_step['sol_KNO3']
                    nano3_harvested += prev_step['sol_NaNO3']
        
        c1, c2, c3 = st.columns(3)
        with c1:
            st.metric("累计收获纯 KNO₃ 固体", f"{kno3_harvested:.1f} g")
        with c2:
            st.metric("累计收获纯 NaNO₃ 固体", f"{nano3_harvested:.1f} g")
        with c3:
            if len(st.session_state.history) >= 5:
                st.markdown("🎯 **工艺设计评语**：\n"
                            "经典的**分数结晶法**利用了 $KNO_3$ 和 $NaNO_3$ 随温度溶解度变化的巨大差异，"
                            "实现了两种强电解质盐的高效分离。第一步在低温(25°C)下析出极纯的 $KNO_3$，"
                            "第二步在高温(100°C)蒸发下析出 $NaNO_3$，实现了盐的循环与分步回收。")
            else:
                st.markdown("💡 **操作建议**：\n"
                            "您可以尝试点击左侧的“载入经典分离案例”，"
                            "系统将自动演练经典的**分数结晶（变温-恒温蒸发）分离路线**，"
                            "观察物料的转移和相图上的折线走向。")
                            
        st.markdown('</div>', unsafe_allow_html=True)


# ====================================================
# TAB 4: THEORY & DERIVATIONS (理论推导与公式)
# ====================================================
with tab4:
    st.markdown('<div class="card-header">相平衡基础热力学公式推导</div>', unsafe_allow_html=True)
    
    with st.container(border=True):
        st.markdown("### 一、二元系统相平衡通式")
        st.markdown(r"考虑 $\alpha$ 相和 $\beta$ 相达平衡，且两相中均有 A 和 B 两组分：")
        st.latex(r"\alpha(\mathrm{A, B}) \rightleftharpoons \beta(\mathrm{A, B})")
        
        st.markdown(r"根据相平衡条件，两相中各组分的化学势必须相等：")
        st.latex(r"\mu_A^\alpha(T, p, x_A^\alpha) = \mu_A^\beta(T, p, x_A^\beta) \qquad \text{(12.16)}")
        st.latex(r"\mu_B^\alpha(T, p, x_B^\alpha) = \mu_B^\beta(T, p, x_B^\beta) \qquad \text{(12.17)}")
        
        st.markdown(r"由式 (12.16) 和式 (12.17) 全微分并结合吉布斯-杜亥姆 (Gibbs-Duhem) 公式，可以推导得到**二元系统相平衡通式 (式 12.20)**：")
        st.latex(r"\frac{y_A - x_A}{1 - x_A} \left(\frac{\partial \mu_A}{\partial x_A}\right)_{T,p} dx_A = \left[y_A(V_{A,m}^\beta - V_{A,m}^\alpha) + (1-y_A)(V_{B,m}^\beta - V_{B,m}^\alpha)\right] dp - \left[y_A(S_{A,m}^\beta - S_{A,m}^\alpha) + (1-y_A)(S_{B,m}^\beta - S_{B,m}^\alpha)\right] dT \qquad \text{(12.20)}")
        
        st.markdown(r"""
其中：
* $x_A$: $\alpha$ 相（一般指液相）中组分 A 的摩尔分数；
* $y_A$: $\beta$ 相（一般指气相或固相）中组分 A 的摩尔分数；
* $V_{i,m}$: 摩尔体积； $S_{i,m}$: 摩尔熵。
""")
        
    with st.container(border=True):
        st.markdown("### 二、气-液平衡简化方程")
        
        st.markdown("#### 1. 恒温条件 (p-x 图)")
        st.markdown(r"若 $\alpha$ 相为液相，$\beta$ 相为气相，且气相为理想气体、液相为理想溶液（即化学势满足理想活度 $\mu_A = \mu_A^* + RT \ln x_A$）：")
        st.latex(r"\left(\frac{\partial p}{\partial x_A}\right)_T = p_A^* - p_B^* \qquad \text{(式5)}")
        st.latex(r"\left(\frac{\partial p}{\partial y_A}\right)_T = \frac{y_A - x_A}{y_A(1 - y_A)} p = \left(\frac{1}{p_B^*} - \frac{1}{p_A^*}\right) p^2 \qquad \text{(式6)}")
        
        st.markdown(r"""
* **物理意义**：式 (5) 说明理想溶液的液相线（泡点线）在恒温下呈**直线**；式 (6) 说明气相线（露点线）在恒温下呈**双曲线**。
* **共沸点条件**：当 $y_A = x_A$ 时，$\left(\frac{\partial p}{\partial x_A}\right)_T = 0$，系统存在最高或最低压力共沸点（如乙醇-水体系）。
""")
        
        st.markdown("#### 2. 恒压条件 (T-x 图)")
        st.markdown(r"将气相视为理想气体，液相视为理想溶液，恒压下：")
        st.latex(r"\left(\frac{\partial T}{\partial x_A}\right)_p = - \frac{RT^2}{\Delta_{vap} H_m} \frac{y_A - x_A}{x_A (1-x_A)} \qquad \text{(式8)}")
        st.latex(r"\left(\frac{\partial T}{\partial y_A}\right)_p = - \frac{RT^2}{\Delta_{vap} H_m} \frac{y_A - x_A}{y_A (1-y_A)} \qquad \text{(式9)}")
        
        st.markdown(r"""
* **物理意义**：式 (8) 和 (9) 确定了 T-x 图中液相线和气相线的倾斜方向。例如若 $y_A > x_A$ (易挥发组分富集在气相)，则 $\left(\frac{\partial T}{\partial x_A}\right)_p < 0$，即随着易挥发组分增加，沸点降低。
""")
        
    with st.container(border=True):
        st.markdown("### 三、固-液平衡简化方程")
        
        st.markdown("#### 1. 生成完全互溶固溶体")
        st.markdown("当液相和固相均成理想溶液时，液相线与固相线方程为：")
        st.latex(r"\ln\left(\frac{x_i^l}{x_i^s}\right) = \frac{\Delta_{fus} H_{m,i}}{R} \left(\frac{1}{T} - \frac{1}{T_i^*}\right) \qquad \text{(式10, 11)}")
        st.markdown("通过联立 A 和 B 两组分方程，可直接解析求出任意温度 $T$ 下的液相线组成 $x_A$ 和固相线组成 $y_A$。")
        
        st.markdown("#### 2. 简单低共熔体系 (固相完全不互溶)")
        st.markdown("当固相为纯固体（$y_A = 1$ 或 $y_B = 1$），液相呈理想溶液时（即没有固溶体生成），由式 (12) 积分得**凝固点降低公式**：")
        st.latex(r"\ln x_A = \frac{\Delta_{fus} H_m(\mathrm{A})}{R} \left(\frac{1}{T_A^*} - \frac{1}{T}\right) \qquad \text{(式13)}")
        st.latex(r"\ln x_B = \ln(1-x_A) = \frac{\Delta_{fus} H_m(\mathrm{B})}{R} \left(\frac{1}{T_B^*} - \frac{1}{T}\right) \qquad \text{(式14)}")
        
        st.markdown(r"""
* **物理意义**：两组分的溶解度曲线（液相线）相交于**三相共晶点 E**。在此点，液相与纯固体 A、纯固体 B 三相共存，温度和组成恒定。
""")
    with st.container(border=True):
        st.markdown("### 四、一级相变与二级相变热力学比较")
        st.markdown("相变伴随着物质微观从有序到无序（或反之）的转变。依据 **Ehrenfest (埃伦菲斯特) 分类法**，根据吉布斯自由能 $G$（或化学势 μ）对温度 and 压力的各阶偏导数的连续性，相变可分为一级与二级相变。")
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown(r"**1. 一级相变 (First-order Phase Transition)**")
            st.markdown(r"* **热力学定义**：两相平衡时化学势 μ 连续，但其对 $T, p$ 的一阶偏导数（体积 $V_m$ 和熵 $S_m$）不连续，发生突变：")
            st.latex(r"\left(\frac{\partial \mu_1}{\partial p}\right)_T \neq \left(\frac{\partial \mu_2}{\partial p}\right)_T \implies V_{m,1} \neq V_{m,2}")
            st.latex(r"\left(\frac{\partial \mu_1}{\partial T}\right)_p \neq \left(\frac{\partial \mu_2}{\partial T}\right)_p \implies S_{m,1} \neq S_{m,2}")
            st.markdown(r"* **物理特征**：相变发生时伴随着**体积突变** (ΔV_m ≠ 0) 与**相变潜热** (ΔH_m = T_c ΔS_m ≠ 0)。")
            st.markdown(r"* **常见例子**：冰融化为水、水蒸发、晶体凝固等。")
        with col2:
            st.markdown(r"**2. 二级相变 (Second-order Phase Transition)**")
            st.markdown(r"* **热力学定义**：两相平衡时化学势 μ 及其一阶偏导数均连续，但其对 $T, p$ 的二阶偏导数（热容 $C_{p,m}$、体膨胀系数 α、等温压缩率 κ）不连续，发生突变：")
            st.latex(r"V_{m,1} = V_{m,2}, \quad S_{m,1} = S_{m,2}")
            st.latex(r"\left(\frac{\partial^2 \mu_1}{\partial T^2}\right)_p \neq \left(\frac{\partial^2 \mu_2}{\partial T^2}\right)_p \implies C_{p,m,1} \neq C_{p,m,2}")
            st.latex(r"\left(\frac{\partial^2 \mu_1}{\partial p^2}\right)_T \neq \left(\frac{\partial^2 \mu_2}{\partial p^2}\right)_T \implies \kappa_1 \neq \kappa_2")
            st.markdown(r"* **物理特征**：相变发生时**无体积改变**、**无相变潜热**，但热容、热膨胀系数、等温压缩率在相变点发生阶跃或出现 λ 峰。")
            st.markdown(r"* **常见例子**：合金的有序-无序转变、超流氦转变、超导转变、铁磁-顺磁转变（居里点）。")
            
        st.write("---")
        st.markdown("#### 🔍 交互式相变热力学曲线模拟 (Plotly)")
        st.markdown("通过下方交互界面，可以直观对比一级相变与二级相变中化学势 μ(T)、摩尔熵 Sm(T) 和热容 Cp,m(T) 随温度变化的特征曲线。")
        
        transition_type = st.radio(
            "选择相变类型进行对比：",
            ["一级相变 (First-order)", "二级相变 (Second-order)"],
            horizontal=True
        )
        
        import numpy as np
        import plotly.graph_objects as go
        from plotly.subplots import make_subplots
        
        T_c = 100.0
        T = np.linspace(50, 150, 300)
        
        fig = make_subplots(
            rows=1, cols=3, 
            subplot_titles=(
                "化学势 μ(T)", 
                "摩尔熵 Sm(T) = -(∂μ/∂T)p", 
                "摩尔等压热容 Cp,m(T) = T(∂Sm/∂T)p"
            )
        )
        
        if transition_type == "一级相变 (First-order)":
            mu = np.where(T < T_c, -0.2 * T, -0.2 * T_c - 0.6 * (T - T_c))
            S_m = np.where(T < T_c, 0.2, 0.6)
            
            C_p = np.zeros_like(T)
            C_p += 1.0 + 80.0 * np.exp(-((T - T_c) / 1.5)**2)
            
            fig.add_trace(go.Scatter(x=T, y=mu, name="化学势", line=dict(color="#1f77b4", width=3)), row=1, col=1)
            fig.add_trace(go.Scatter(x=T, y=S_m, name="摩尔熵", line=dict(color="#ff7f0e", width=3)), row=1, col=2)
            fig.add_trace(go.Scatter(x=T, y=C_p, name="热容 (潜热峰)", line=dict(color="#2ca02c", width=3, dash="dash")), row=1, col=3)
            
            fig.add_annotation(
                x=T_c, y=45, text="潜热释放 (无限大热容峰)", 
                showarrow=True, arrowhead=2, row=1, col=3
            )
            fig.add_annotation(
                x=T_c, y=-20, text="斜率突变 (Kink)", 
                showarrow=True, arrowhead=2, row=1, col=1
            )
            fig.add_annotation(
                x=T_c, y=0.4, text="熵突变 ΔSm", 
                showarrow=True, arrowhead=2, row=1, col=2
            )
        else:
            S_m = np.where(T < T_c, 0.2 + 0.003 * T, 0.5 + 0.009 * (T - T_c))
            
            mu_Tc = - (0.2 * T_c + 0.0015 * T_c**2)
            mu = np.where(T < T_c, 
                          - (0.2 * T + 0.0015 * T**2), 
                          mu_Tc - (0.5 * (T - T_c) + 0.0045 * (T - T_c)**2))
            
            C_p = np.where(
                T < T_c,
                1.5 + 8.0 / ((T_c - T)**0.45 + 1.2),
                1.5 + 4.5 / ((T - T_c)**0.55 + 1.2)
            )
            
            fig.add_trace(go.Scatter(x=T, y=mu, name="化学势", line=dict(color="#1f77b4", width=3)), row=1, col=1)
            fig.add_trace(go.Scatter(x=T, y=S_m, name="摩尔熵", line=dict(color="#ff7f0e", width=3)), row=1, col=2)
            fig.add_trace(go.Scatter(x=T, y=C_p, name="热容 (λ 峰)", line=dict(color="#d62728", width=3)), row=1, col=3)
            
            fig.add_annotation(
                x=T_c, y=7.5, text="λ 型尖峰 (不连续)", 
                showarrow=True, arrowhead=2, row=1, col=3
            )
            fig.add_annotation(
                x=T_c, y=0.5, text="熵连续但斜率突变", 
                showarrow=True, arrowhead=2, row=1, col=2
            )
            fig.add_annotation(
                x=T_c, y=mu_Tc, text="化学势及斜率均连续", 
                showarrow=True, arrowhead=2, row=1, col=1
            )
            
        fig.update_layout(
            height=380,
            margin=dict(l=20, r=20, t=40, b=20),
            showlegend=False,
            template="plotly_white",
            xaxis=dict(title="温度 T"),
            yaxis=dict(title="化学势 μ"),
            xaxis2=dict(title="温度 T"),
            yaxis2=dict(title="摩尔熵 Sm"),
            xaxis3=dict(title="温度 T"),
            yaxis3=dict(title="热容 Cp,m")
        )
        st.plotly_chart(fig, use_container_width=True)
        
        st.markdown("#### 3. 二级相变热力学关系与 Ehrenfest 方程")
        st.markdown(r"二级相变中，化学势的二阶偏导数与宏观可测量物理量（等压热容 $C_{p,m}$、体膨胀系数 α、等温压缩率 κ）紧密相连：")
        st.latex(r"\frac{\partial^2 \mu}{\partial T^2} = -\left(\frac{\partial S_m}{\partial T}\right)_p = -\frac{C_{p,m}}{T}")
        st.latex(r"\frac{\partial^2 \mu}{\partial T \partial p} = \left(\frac{\partial V_m}{\partial T}\right)_p = \alpha V_m")
        st.latex(r"\frac{\partial^2 \mu}{\partial p^2} = \left(\frac{\partial V_m}{\partial p}\right)_T = -\kappa V_m")
        
        st.markdown(r"由于相变线两侧体积连续 ($V_{m,1} = V_{m,2}$) 和熵连续 ($S_{m,1} = S_{m,2}$)，两相沿相平衡界线的全微分必相等 ($dV_{m,1} = dV_{m,2}$ 且 $dS_{m,1} = dS_{m,2}$)，从而推导得到**埃伦菲斯特 (Ehrenfest) 方程**：")
        st.markdown(r"1. **体积连续方程**：")
        st.latex(r"\frac{dp}{dT} = \frac{\Delta \alpha}{\Delta \kappa} \qquad \text{(式21)}")
        st.markdown(r"2. **熵连续方程**（结合 Maxwell 关系式 $\left(\frac{\partial S}{\partial p}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_p$）：")
        st.latex(r"\frac{dp}{dT} = \frac{\Delta C_p}{T V_m \Delta \alpha} \qquad \text{(式22)}")
        st.markdown(r"3. **两式联立所得的二相线斜率相容性关系式**：")
        st.latex(r"\frac{\Delta C_p \Delta \kappa}{T V_m (\Delta \alpha)^2} = 1 \qquad \text{(式23)}")
        
        st.markdown("#### 4. 微观机制与典型物理实例")
        st.markdown(r"二级相变在相变点不发生热量的直接阶跃（即没有潜热），而是表现为晶格对称性、磁有序度或量子相干性的突变，常伴有**无序-有序转变**。")
        st.markdown(r"* **黄铜 (Cu-Zn 合金) 的有序-无序转变**：")
        st.markdown(r"  在低温下，黄铜 of Cu 和 Zn 原子分别占据特定的格点（晶胞中心与顶角），呈长程有序。随温度升高，热运动导致原子位置交换。当温度达到 $T_c = 742$ K 时，有序度彻底消失为完全无序，热容 $C_{p,m}$ 出现著名的 λ 峰突变。")
        st.markdown(r"* **液氦 I 与液氦 II 的超流转变 (He-4 λ 转变)**：")
        st.markdown(r"  在常压和 $2.17$ K 下发生二级相变转化为液氦 II。此时液氦 II 的黏度突然降为零，表现出**超流动性 (Superfluidity)** 与极高的热传导率。这是玻色-爱因斯坦凝聚 of 宏观量子效应表现。")
        st.markdown(r"* **铁磁-顺磁转变 (居里点转变)**：")
        st.markdown(r"  磁性物质（如金属铁）在居里温度 $T_c$ 以下，由于分子场作用磁矩平行排列形成磁畴。当升温至 $T_c$ 时，热运动克服了分子场，磁畴完全瓦解，物质转变为顺磁性，在 $T_c$ 时发生二级相变。")

        st.markdown(r"#### 5. 朗道二级相变理论与序参量 (Landau Theory & Order Parameter)")
        st.markdown(r"1937年，苏联物理学家**朗道 (L.D. Landau)** 提出了二级相变的唯象理论，其核心思想是引入**序参量 (Order Parameter) $\eta$** 来描述系统对称性的变化：")
        st.markdown(r"* **有序度与对称性破缺**：")
        st.markdown(r"  - 在高温对称相（如顺磁态），系统对称性高，无序度大，序参量 $\eta = 0$。")
        st.markdown(r"  - 在低温有序相（如铁磁态），系统对称性降低（发生**对称性破缺**），有序度增大，序参量 $\eta \neq 0$。")
        st.markdown(r"* **吉布斯自由能展开**：")
        st.markdown(r"  在临界点 $T_c$ 附近，序参量 $\eta$ 很小，朗道将吉布斯自由能 $G(T, p, \eta)$ 展开为 $\eta$ 的幂级数（由于对称性，通常只包含偶次方项）：")
        st.latex(r"G(T, p, \eta) = G_0(T, p) + A(T, p)\eta^2 + B(T, p)\eta^4 + \dots \qquad \text{(式24)}")
        st.markdown(r"  其中，为了使系统在 $T > T_c$ 时稳定在 $\eta = 0$，且在 $T < T_c$ 时稳定在 $\eta \neq 0$，参数 $A$ 必须在 $T_c$ 处改变符号。通常假设：")
        st.latex(r"A(T, p) = a(T - T_c) \quad (a > 0), \qquad B(T, p) = b > 0 \qquad \text{(式25)}")
        st.markdown(r"* **相变分析**：")
        st.markdown(r"  由热力学平衡条件 $\left(\frac{\partial G}{\partial \eta}\right)_{T,p} = 0$，可得：")
        st.latex(r"2a(T - T_c)\eta + 4b\eta^3 = 0 \implies \eta = \begin{cases} 0 & (T \ge T_c) \\ \sqrt{\frac{a(T_c - T)}{2b}} & (T < T_c) \end{cases} \qquad \text{(式26)}")
        st.markdown(r"  式 (26) 表明：在 $T_c$ 以下，序参量以临界指数 $\beta = 1/2$ 随着温度降低而**连续地**从零增长，这正是二级相变的重要特征！")
